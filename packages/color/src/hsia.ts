import { IVector } from "@thi.ng/vectors3/api";
import { declareIndices } from "@thi.ng/vectors3/internal/accessors";
import { Color, ColorMode } from "./api";
import { AColor } from "./internal/acolor";
import { ensureArgs } from "./internal/ctor-args";

export function hsia(col: Color): HSIA
export function hsia(h?: number, s?: number, i?: number, a?: number): HSIA;
export function hsia(...args: any[]) {
    return new HSIA(ensureArgs(args));
}

export class HSIA extends AColor<HSIA> implements
    IVector<HSIA> {

    h: number;
    s: number;
    i: number;
    a: number;

    get mode() {
        return ColorMode.HSIA;
    }

    copy() {
        return new HSIA(this.deref());
    }

    copyView() {
        return new HSIA(this.buf, this.offset, this.stride);
    }

    empty() {
        return new HSIA();
    }
}

declareIndices(HSIA.prototype, ["h", "s", "i", "a"]);
