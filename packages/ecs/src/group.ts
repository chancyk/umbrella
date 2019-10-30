import {
    assert,
    Event,
    Fn3,
    IID,
    IObjectOf,
    TypedArray
} from "@thi.ng/api";
import { intersection } from "@thi.ng/associative";
import {
    ComponentInfo,
    ComponentTuple,
    EVENT_ADDED,
    EVENT_PRE_REMOVE,
    GroupOpts,
    ICache
} from "./api";
import { Component } from "./component";
import { UnboundedCache } from "./unbounded";

let NEXT_ID = 0;

export class Group implements IID<string> {
    readonly id: string;

    components: Component<TypedArray>[];
    owned: Component<TypedArray>[];
    ids: Set<number>;
    n: number;

    info: IObjectOf<ComponentInfo>;
    cache: ICache<ComponentTuple>;

    constructor(
        comps: Component<TypedArray>[],
        owned: Component<TypedArray>[] = comps,
        opts: Partial<GroupOpts> = {}
    ) {
        this.components = comps;
        this.ids = new Set();
        this.n = 0;
        this.id = opts.id || `group-${NEXT_ID++}`;
        this.cache = opts.cache || new UnboundedCache();

        this.info = comps.reduce((acc: IObjectOf<ComponentInfo>, c) => {
            acc[c.id] = { buffer: c.vals, size: c.size, stride: c.stride };
            return acc;
        }, {});

        // update ownerships
        owned.forEach((c) => {
            assert(
                comps.includes(c),
                `owned component ${c.id} not in given list`
            );
            assert(
                !c.owner,
                () => `component ${c.id} already owned by ${c.owner!.id}`
            );
            c.owner = this;
        });
        this.owned = owned;
        this.addExisting();

        comps.forEach((comp) => {
            comp.addListener(EVENT_ADDED, this.onAddListener, this);
            comp.addListener(EVENT_PRE_REMOVE, this.onRemoveListener, this);
        });
    }

    release() {
        this.components.forEach((comp) => {
            comp.removeListener(EVENT_ADDED, this.onAddListener, this);
            comp.removeListener(EVENT_PRE_REMOVE, this.onRemoveListener, this);
        });
        this.cache.release();
    }

    has(key: number) {
        return this.ids.has(key);
    }

    *values() {
        const comps = this.components;
        const numComps = comps.length;
        for (let i = this.n; --i >= 0; ) {
            const tuple: any = { id: comps[0].dense[i] };
            for (let j = numComps; --j >= 0; ) {
                const c = comps[j];
                tuple[c.id] = c.getIndex(i);
            }
            yield tuple;
        }
    }

    run(
        fn: (info: IObjectOf<ComponentInfo>, n: number, ...xs: any[]) => void,
        ...xs: any[]
    ) {
        this.ensureFullyOwned();
        fn(this.info, this.n, ...xs);
    }

    forEachRaw(fn: Fn3<IObjectOf<ComponentInfo>, number, number, void>) {
        this.ensureFullyOwned();
        const ref = this.components[0].dense;
        for (let i = 0, n = this.n; i < n; i++) {
            fn(this.info, ref[i], i);
        }
    }

    forEach(fn: Fn3<ComponentTuple, number, number, void>) {
        const { components: comps, cache } = this;
        const n = comps.length;
        let i = 0;
        for (let id of this.ids) {
            const tuple = cache.getSet(id, () => {
                const tuple: ComponentTuple = {};
                for (let j = n; --j >= 0; ) {
                    const c = comps[j];
                    tuple[c.id] = c.getIndex(c.sparse[id])!;
                }
                return tuple;
            });
            fn(tuple, id, i);
            i++;
        }
    }

    protected onAddListener(e: Event) {
        // console.log(`add ${e.target.id}: ${e.value}`);
        this.addID(e.value);
    }

    protected onRemoveListener(e: Event) {
        // console.log(`delete ${e.target.id}: ${e.value}`);
        this.removeID(e.value);
    }

    protected addExisting() {
        const existing = this.components
            .slice(1)
            .reduce(
                (acc, c) => intersection(acc, new Set(c.keys())),
                new Set<number>(this.components[0].keys())
            );
        for (let id of existing) {
            this.addID(id, false);
        }
    }

    protected addID(id: number, validate = true) {
        if (validate && !this.validID(id)) return;
        this.ids.add(id);
        const n = this.n++;
        for (let comp of this.owned) {
            // console.log(`moving id: ${id} in ${comp.id}...`);
            comp.swapIndices(comp.sparse[id], n);
        }
    }

    protected removeID(id: number, validate = true) {
        if (validate && !this.validID(id)) return;
        this.ids.delete(id);
        this.cache.delete(id);
        const n = --this.n;
        for (let comp of this.owned) {
            // console.log(`moving id: ${id} in ${comp.id}...`);
            comp.swapIndices(comp.sparse[id], n);
        }
    }

    protected validID(id: number) {
        for (let comp of this.components) {
            if (!comp.has(id)) return false;
        }
        return true;
    }

    protected ensureFullyOwned() {
        assert(
            this.owned.length === this.components.length,
            `group ${this.id} isn't fully owning its components`
        );
    }
}
