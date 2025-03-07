<!-- This file is generated - DO NOT EDIT! -->

# ![rstream](https://media.thi.ng/umbrella/banners/thing-rstream.svg?ab63c74c)

[![npm version](https://img.shields.io/npm/v/@thi.ng/rstream.svg)](https://www.npmjs.com/package/@thi.ng/rstream)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/rstream.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
- [Conceptual differences to RxJS](#conceptual-differences-to-rxjs)
  - [Status](#status)
  - [Breaking changes in 5.0.0](#breaking-changes-in-500)
  - [Support packages](#support-packages)
  - [Related packages](#related-packages)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
  - [Common configuration options](#common-configuration-options)
  - [Stream creation](#stream-creation)
    - [Stream](#stream)
  - [IDeref support](#ideref-support)
    - [Subscription](#subscription)
    - [Other stream creation helpers](#other-stream-creation-helpers)
  - [Meta streams](#meta-streams)
  - [Stream merging](#stream-merging)
    - [Unordered merge from multiple inputs (dynamic add/remove)](#unordered-merge-from-multiple-inputs-dynamic-add-remove)
    - [Synchronized merge and labeled tuple objects](#synchronized-merge-and-labeled-tuple-objects)
  - [Stream splitting](#stream-splitting)
    - [Topic based splitting](#topic-based-splitting)
    - [Splitting via predicate](#splitting-via-predicate)
  - [Side-chaining](#side-chaining)
    - [Input chunking / buffering, controlled by sidechain](#input-chunking---buffering--controlled-by-sidechain)
    - [Input toggling, controlled by sidechain](#input-toggling--controlled-by-sidechain)
  - [Worker support](#worker-support)
    - [Parallel stream processing via workers](#parallel-stream-processing-via-workers)
    - [Stream processing via workers](#stream-processing-via-workers)
  - [Other subscription ops](#other-subscription-ops)
- [Authors](#authors)
  - [Maintainer](#maintainer)
  - [Contributors](#contributors)
- [License](#license)

## About

Reactive streams & subscription primitives for constructing dataflow graphs / pipelines.

This library provides & uses three key building blocks for reactive
programming:

- **Stream sources**: event targets, iterables, timers,
  promises,watches, workers, manual-push...
- **Subscriptions**: chained stream processors, each subscribable
  (one-tmany) itself
- **Transducers**: stream transformers, either as individual
  subscription or to transform incoming values for a single
  subscription. See packages/transducers) for 100+ composable operators.
- **Recursive teardown**: Whenever possible, and depending on
  configuration, unsubscriptions initiate cleanup and propagate to
  parent(s).
- **Workers**: highly configurable, web worker integration for
  concurrent / parallel stream processing (fork-join, tunneled stream
  processing, etc.)

## Conceptual differences to RxJS

(No value judgments implied - there's room for both approaches!)

- Streams are not the same as Observables: I.e. stream sources are NOT
  (often just cannot) re-run for each new sub added. Only the first sub
  is guaranteed to receive **all** values. Subs added at a later time
  MIGHT not receive earlier emitted values, but only the most recent
  emitted and any future values
- Every subscription supports any number of subscribers, which can be
  added/removed at any time
- Depending on configuration options, every unsubscription recursively
  triggers upstream unsubscriptions (provided a parent has no other
  active child subscriptions)
- Every subscription can have its own transducer transforming incoming
  values (possibly into multiple new ones)
- Transducers can create streams themselves (only for `merge()`
  /`sync()`)
- Transducers can cause early stream termination and subsequent
  unwinding for its parent and downstream subscriptions.
- Values can be manually injected into the stream pipeline / graph at
  any point
- Unhandled errors in a subscription will move the subscription into an
  error state and cause unsubscription from parent (if any). Unhandled
  errors in stream sources will cancel the stream.
- _Much_ smaller API surface, since most common & custom operations can
  be solved via available transducers. Therefore there's less of a need
  to provide specialized functions (map / filter etc.) and gain more
  flexibility in terms of composing new operations.
- IMHO less confusing naming / terminology (only streams (producers) &
  subscriptions (consumers))

### Status

**STABLE** - used in production

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Brstream%5D+in%3Atitle)

### Breaking changes in 5.0.0

Type inference for `sync()` (aka `StreamSync`), one of the main pillars of this
package, was semi-broken in earlier versions and has been updated to better
infer result types from the given object of input streams. For this work, input
sources now MUST be given as object (array form is not allowed anymore, see
below). Furthermore, the two generics have different meanings now and unless you
were using `sync<any,any>(...)` these will need to be updated (or, better yet,
removed). See
[source](https://github.com/thi-ng/umbrella/blob/develop/packages/rstream/src/stream-sync.ts)
for more details.

```ts
// NEW approach
const main = sync({
  src: {
    a: reactive(23),
    b: reactive("foo").map((x) => x.toUpperCase()),
    c: reactive([1, 2])
  }
});
```

`main`'s type can now be inferred as:

```ts
StreamSync<
  { a: Stream<number>, b: Subscription<string,string>, c: Stream<number[]> },
  { a: number, b: string, c: number[] }
>
```

If the `xform` (transducer) option is given, the result will be inferred based
on the transducer's result type...

To compensate for the loss of specifying input sources as array (rather than as
an object), the [`autoObj()`
reducer](https://github.com/thi-ng/umbrella/blob/develop/packages/transducers/src/rfn/auto-obj.ts)
has been added, allowing for quick conversion of an array into an object with
auto-labeled keys.

```ts
const main = sync({
  src: autoObj("input", [reactive(23), reactive("foo"), reactive([1, 2])])
});
```

In this case the type of `main` will be inferred as:

```ts
StreamSync<
  IObjectOf<Stream<number> | Stream<string> | Stream<number[]>>,
  IObjectOf<number | string | number[]>
>
```

### Support packages

- [@thi.ng/rstream-csp](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-csp) - [@thi.ng/csp](https://github.com/thi-ng/umbrella/tree/develop/packages/csp) bridge module for [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/rstream-dot](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-dot) - Graphviz DOT conversion of [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream) dataflow graph topologies
- [@thi.ng/rstream-gestures](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-gestures) - Unified mouse, mouse wheel & multi-touch event stream abstraction
- [@thi.ng/rstream-graph](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-graph) - Declarative dataflow graph construction for [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/rstream-log](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-log) - Structured, multilevel & hierarchical loggers based on [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/rstream-log-file](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-log-file) - File output handler for structured, multilevel & hierarchical loggers based on [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/rstream-query](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-query) - [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream) based triple store & reactive query engine

### Related packages

- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers) - Lightweight transducer implementations for ES6 / TypeScript

## Installation

```bash
yarn add @thi.ng/rstream
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/rstream?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/rstream/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 5.44 KB / CJS: 5.62 KB / UMD: 5.57 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/arrays](https://github.com/thi-ng/umbrella/tree/develop/packages/arrays)
- [@thi.ng/associative](https://github.com/thi-ng/umbrella/tree/develop/packages/associative)
- [@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

| Screenshot                                                                                                                 | Description                                                                      | Live demo                                                 | Source                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/adaptive-threshold.png" width="240"/>  | Interactive image processing (adaptive threshold)                                | [Demo](https://demo.thi.ng/umbrella/adaptive-threshold/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/adaptive-threshold)  |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/bitmap-font.gif" width="240"/>         | Figlet-style bitmap font creation with transducers                               | [Demo](https://demo.thi.ng/umbrella/bitmap-font/)         | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/bitmap-font)         |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/crypto-chart.png" width="240"/>        | Basic crypto-currency candle chart with multiple moving averages plots           | [Demo](https://demo.thi.ng/umbrella/crypto-chart/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/crypto-chart)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/hdom-canvas-draw.jpg" width="240"/>    | Interactive pattern drawing demo using transducers                               | [Demo](https://demo.thi.ng/umbrella/hdom-canvas-draw/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-canvas-draw)    |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/imgui/imgui-all.png" width="240"/>              | Canvas based Immediate Mode GUI components                                       | [Demo](https://demo.thi.ng/umbrella/imgui/)               | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/imgui)               |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/mandelbrot.jpg" width="240"/>          | Worker based, interactive Mandelbrot visualization                               | [Demo](https://demo.thi.ng/umbrella/mandelbrot/)          | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/mandelbrot)          |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/markdown-parser.jpg" width="240"/>     | Minimal Markdown to Hiccup to HTML parser / transformer                          | [Demo](https://demo.thi.ng/umbrella/markdown/)            | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/markdown)            |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/parse-playground.png" width="240"/>    | Parser grammar livecoding editor/playground & codegen                            | [Demo](https://demo.thi.ng/umbrella/parse-playground/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/parse-playground)    |
|                                                                                                                            | Demonstates various rdom usage patterns                                          | [Demo](https://demo.thi.ng/umbrella/rdom-basics/)         | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-basics)         |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rdom-lissajous.png" width="240"/>      | rdom & hiccup-canvas interop test                                                | [Demo](https://demo.thi.ng/umbrella/rdom-lissajous/)      | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-lissajous)      |
|                                                                                                                            | Full umbrella repo doc string search w/ paginated results                        | [Demo](https://demo.thi.ng/umbrella/rdom-search-docs/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-search-docs)    |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rdom-svg-nodes.png" width="240"/>      | rdom powered SVG graph with draggable nodes                                      | [Demo](https://demo.thi.ng/umbrella/rdom-svg-nodes/)      | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-svg-nodes)      |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rotating-voronoi.jpg" width="240"/>    | Animated Voronoi diagram, cubic splines & SVG download                           | [Demo](https://demo.thi.ng/umbrella/rotating-voronoi/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rotating-voronoi)    |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-event-loop.png" width="240"/>  | Minimal demo of using rstream constructs to form an interceptor-style event loop | [Demo](https://demo.thi.ng/umbrella/rstream-event-loop/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-event-loop)  |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-grid.jpg" width="240"/>        | Interactive grid generator, SVG generation & export, undo/redo support           | [Demo](https://demo.thi.ng/umbrella/rstream-grid/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-grid)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-spreadsheet.png" width="240"/> | rstream based spreadsheet w/ S-expression formula DSL                            | [Demo](https://demo.thi.ng/umbrella/rstream-spreadsheet/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-spreadsheet) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/shader-ast-workers.jpg" width="240"/>  | Fork-join worker-based raymarch renderer                                         | [Demo](https://demo.thi.ng/umbrella/shader-ast-workers/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/shader-ast-workers)  |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/talk-slides.png" width="240"/>         | hdom based slide deck viewer & slides from my ClojureX 2018 keynote              | [Demo](https://demo.thi.ng/umbrella/talk-slides/)         | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/talk-slides)         |
|                                                                                                                            | Transducer & rstream based hdom UI updates                                       | [Demo](https://demo.thi.ng/umbrella/transducers-hdom/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/transducers-hdom)    |

## API

[Generated API docs](https://docs.thi.ng/umbrella/rstream/)

### Common configuration options

Since version 3.0.0 all stream and subscription factory functions take
an optional object of configuration options with **at least** these keys
(each optional):

```ts
interface CommonOpts {
    /**
     * Internal ID associated with this stream. If omitted, an
     * autogenerated ID will be used.
     */
    id: string;
    /**
     * If false or `CloseMode.NEVER`, the stream stays active even if
     * all inputs are done. If true (default) or `CloseMode.LAST`, the
     * stream closes when the last input is done. If `CloseMode.FIRST`,
     * the instance closes when the first input is done.
     *
     * @defaultValue CloseMode.LAST
     */
    closeIn: CloseMode;
    /**
     * If false or `CloseMode.NEVER`, the stream stays active once there
     * are no more subscribers. If true (default) or `CloseMode.LAST`,
     * the stream closes when the last subscriber has unsubscribed. If
     * `CloseMode.FIRST`, the instance closes when the first subscriber
     * disconnects.
     *
     * @defaultValue CloseMode.LAST
     */
    closeOut: CloseMode;
    /**
     * If true (default), stream caches last received value and pushes
     * it to new subscriberswhen they subscribe. If false, calling
     * `.deref()` on this stream will always return `undefined`.
     *
     * @defaultValue true
     */
    cache: boolean;
}
```

### Stream creation

#### Stream

Source: [stream()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream.ts)

Creates a new `Stream` instance, optionally with given `StreamSource`
function and / or ID. If a `src` function is provided, the function
will be only called (with the `Stream` instance as single argument)
once the first subscriber has attached to the stream. If the function
returns another function, it will be used for cleanup purposes if the
stream is cancelled, e.g. if the last subscriber has unsubscribed.
Streams are intended as (primarily async) data sources in a dataflow
graph and are the primary construct for the various `from*()`
functions provided by the package. However, streams can also be
triggered manually (from outside the stream), in which case the user
should call `stream.next()` to cause value propagation.

```ts
a = stream<number>((s) => {
    s.next(1);
    s.next(2);
    s.done();
});
a.subscribe(trace("a"));
// a 1
// a 2
// a done

// as reactive value mechanism
b = stream<number>();
// or alternatively
// b = subscription();

b.subscribe(trace("b1"));
b.subscribe(trace("b2"));

// external trigger
b.next(42);
// b1 42
// b2 42
```

### IDeref support

`Stream` (like all other types of `Subscription`) implements the
[@thi.ng/api
`IDeref`](https://github.com/thi-ng/umbrella/blob/develop/packages/api/src/api/deref.ts)
interface which provides read access to a stream's last received value.
This is useful for various purposes, e.g. in combination with
@thi.ng/hdom, which supports direct embedding of streams (i.e. their
values) into UI components (and will be deref'd automatically). If the
stream has not yet emitted a value or if the stream is already done, it
will deref to `undefined`.

Furthermore, all subscription types can be configured (via the `cache`
option) to NOT retain their last emitted value, in which case `.deref()`
will always return `undefined`.

#### Subscription

Source: [subscription()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subscription.ts)

Creates a new `Subscription` instance, the fundamental datatype &
building block provided by this package (`Stream`s are `Subscription`s
too). Subscriptions can be:

- linked into directed graphs (if async, not necessarily DAGs)
- transformed using transducers (incl. early termination)
- can have any number of subscribers (optionally each w/ their own
  transducer)
- recursively unsubscribe themselves from parent after their last
  subscriber unsubscribed
- will go into a non-recoverable error state if NONE of the subscribers
  has an error handler itself
- implement the @thi.ng/api `IDeref` interface

```ts
// as reactive value mechanism (same as with stream() above)
s = subscription<any, any>();
s.subscribe(trace("s1"));
s.subscribe(trace("s2"), tx.filter((x) => x > 25));

// external trigger
s.next(23);
// s1 23
s.next(42);
// s2 42
// s1 42
```

#### Other stream creation helpers

- [reactive()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream.ts) - syntax sugar for `stream()` with initial value
- [fromAtom()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/atom.ts) - streams from value changes in atoms/cursors
- [fromChannel()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-csp) - CSP channel to stream conversion
- [fromEvent()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/event.ts) - events
- [fromDOMEvent()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/event.ts#L25) - DOM events
- [fromInterval()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/interval.ts) - interval based counters
- [fromIterable()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/iterable.ts) - arrays, iterators / generators (async & sync)
- [fromObject()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/object.ts) - object property streams
- [fromPromise()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/promise.ts) - single value stream from promise
- [fromPromises()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/promises.ts) - results from multiple promise
- [fromRAF()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/raf.ts) - requestAnimationFrame() counter (w/ node fallback)
- [fromView()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/view.ts) - derived view changes (see [@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom))
- [fromWorker()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/worker.ts) - messages received from worker
- [trigger()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/trigger.ts) - one-off events

### Meta streams

Source: [metaStream()](https://github.com/thi-ng/umbrella/blob/develop/packages/rstream/src/metastream.ts)

`MetaStream`s are streams of streams. A `MetaStream` is a subscription
type which transforms each incoming value into a new stream, subscribes
to it (via an hidden / internal subscription) and then only passes
values from that stream to its own subscribers. If a new value is
received, the meta stream first unsubscribes from the possibly still
active stream created from the previous input, before creating and
subscribing to the new stream. Hence this stream type is useful for
cases where streams need to be dynamically and invisibly created &
inserted into an existing dataflow topology without changing it, and
with the guarantee that never more than one of these is active at the
same time. Similar behavior (without the restriction in number) can be
achieved using `merge()` (see further below).

The user supplied `factory` function will be called for each incoming
value and is responsible for creating the new stream instances. If the
function returns `null` / `undefined`, no further action will be taken
(acts like a `filter` transducer, i.e. the incoming value is simply
ignored).

```ts
// transform each received odd number into a stream
// producing 3 copies of that number in the metastream
// even numbers are ignored
a = metastream<number, string>(
  (x) => (x & 1)
    ? fromIterable(tx.repeat("odd: " + x, 3), { delay: 100 })
    : null
);

a.subscribe(trace())

a.next(23)
// odd: 23
// odd: 23
// odd: 23

a.next(42) // not odd, ignored by meta factory fn

a.next(43)
// odd: 43
// odd: 43
// odd: 43
```

The factory function does NOT need to create new streams, but too can
merely return other existing streams, and so making the meta stream act
like a switch / stream selector.

If the meta stream is the only subscriber to these input streams, you'll
need to use the `closeOut: CloseMode.NEVER` option when creating the
inputs. This keeps them alive and allows for dynamic switching between
them.

```ts
// infinite inputs
a = fromIterable(
  tx.repeat("a"),
  { delay: 1000, closeOut: CloseMode.NEVER }
);

b = fromIterable(
  tx.repeat("b"),
  { delay: 1000, closeOut: CloseMode.NEVER }
);

// stream selector / switch
m = metaStream((x) => x ? a : b);
m.subscribe(trace("meta from: "));

m.next(true);
// meta from: a

m.next(false);
// meta from: b

m.next(true);
// meta from: a
```

### Stream merging

#### Unordered merge from multiple inputs (dynamic add/remove)

Source: [merge()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream-merge.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-merge.png)

Returns a new `StreamMerge` instance, a subscription type consuming
inputs from multiple inputs and passing received values on to any
subscribers. Input streams can be added and removed dynamically. By
default, `StreamMerge` calls `done()` when the last active input is
done, but this behavior can be overridden via the `close` option, using
`CloseMode` enums.

```ts
merge({
    // input streams w/ different frequencies
    src: [
        fromIterable([1, 2, 3], { delay: 10 }),
        fromIterable([10, 20, 30], { delay: 21 }),
        fromIterable([100, 200, 300], { delay: 7 })
    ]
}).subscribe(trace());
// 100
// 1
// 200
// 10
// 2
// 300
// 3
// 20
// 30
```

Use the [`labeled()`
transducer](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers/src/xform/labeled.ts)
for each input to create a stream of labeled values and track their
provenance:

```ts
merge({
    src: [
        fromIterable([1, 2, 3]).transform(tx.labeled("a")),
        fromIterable([10, 20, 30]).transform(tx.labeled("b")),
    ]
}).subscribe(trace());
// ["a", 1]
// ["b", 10]
// ["a", 2]
// ["b", 20]
// ["a", 3]
// ["b", 30]
```

See
[StreamMergeOpts](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream-merge.ts#L7)
for further reference of the various behavior options.

##### Adding inputs automatically

If the `StreamMerge` receives a `Subscription`-like value from any of
its inputs, it will not be processed as usual, but instead will be added
as new input to the merge and then automatically remove once that stream
is exhausted.

```ts
// stream source w/ transducer mapping values to new streams
a = stream().transform(tx.map((x) => fromIterable(tx.repeat(x, 3))));
// simple 1Hz counter
b = fromInterval(1000);

merge({ src: [a, b] }).subscribe(trace());
// 0
// 1
// 2

// sent "a" will be transformed into stream via above transducer
// and then auto-added as new input to the StreamMerge
a.next("a");
// a
// a
// a
// 3
// 4
```

#### Synchronized merge and labeled tuple objects

Source: [sync()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream-sync.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sync.png)

Similar to `StreamMerge` above, but with extra synchronization of
inputs. Before emitting any new values, `StreamSync` collects values
until at least one has been received from _all_ inputs. Once that's the
case, the collected values are sent as labeled tuple object to
downstream subscribers. Each value in the emitted tuple objects is
stored under their input stream's ID. Only the last value received from
each input is passed on. After the initial tuple has been emitted, you
can choose from two possible behaviors:

1. Any future change in any input will produce a new result tuple. These
   tuples will retain the most recently read values from other inputs.
   This behavior is the default and illustrated in the above schematic.
2. If the `reset` option is `true`, every input will have to provide at
   least one new value again until another result tuple is produced.

Any done inputs are automatically removed. By default, `StreamSync`
calls `done()` when the last active input is done, but this behavior can
be overridden via the `close` constructor option, using `CloseMode` enums.

```ts
const a = stream();
const b = stream();
s = sync<any,any>({ src: { a, b } }).subscribe(trace("result: "));
a.next(1);
b.next(2);
// result: { a: 1, b: 2 }
```

Input streams can be added and removed dynamically and the emitted tuple
size adjusts to the current number of inputs (the next time a value is
received from any input).

If the `reset` option is enabled, the last emitted tuple is allowed to
be incomplete, by default. To only allow complete tuples, also set the
`all` option to `false`.

The synchronization is done via the
[`partitionSync()`](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers/src/xform/partition-sync.ts)
transducer from the @thi.ng/transducers package. See this function's
docs for further details.

See
[StreamSyncOpts](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/stream-sync.ts#L12)
for further reference of the various behavior options.

### Stream splitting

#### Topic based splitting

Source: [pubsub()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/pubsub.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-pubsub.png)

Topic based stream splitter. Applies `topic` function to each
received value and only forwards it to child subscriptions for
returned topic. The actual topic (return value from `topic` fn) can
be of any type, apart from `undefined`. Complex topics (e.g objects /
arrays) are allowed and they're matched with registered topics using
@thi.ng/equiv by default (but customizable via `equiv` option).
Each topic can have any number of subscribers.

If a transducer is specified for the `PubSub`, it is always applied
prior to passing the input to the topic function. I.e. in this case
the topic function will receive the transformed inputs.

PubSub supports dynamic topic subscriptions and unsubscriptions via
`subscribeTopic()` and `unsubscribeTopic()`. However, **the standard
`subscribe()` / `unsubscribe()` methods are NOT supported** (since
meaningless here) and will throw an error! `unsubscribe()` can only be
called WITHOUT argument to unsubscribe the entire `PubSub` instance
(incl. all topic subscriptions) from the parent stream.

#### Splitting via predicate

Source: [bisect()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/bisect.ts)

Returns a new `PubSub` instance using given predicate `pred` as boolean
topic function and `a` & `b` as subscribers for truthy (`a`) and falsy
`b` values.

```ts
fromIterable([1, 2, 3, 4]).subscribe(
    bisect((x) => !!(x & 1), trace("odd"), trace("even"))
);
// odd 1
// even 2
// odd 3
// even 4
// odd done
// even done
```

If `a` or `b` need to be subscribed to directly, then `a` / `b` MUST be
first created as `Subscription` (if not already) and a reference kept
prior to calling `bisect()`.

```ts
const odd = subscription();
const even = subscription();
odd.subscribe(trace("odd"));
odd.subscribe(trace("odd x10"), tx.map((x) => x * 10));
even.subscribe(trace("even"));

fromIterable([1, 2, 3, 4]).subscribe(bisect((x) => !!(x & 1), odd, even));
// odd x10 10
// odd 1
// even 2
// odd x10 30
// odd 3
// even 4
// odd done
// odd x10 done
// even done
```

### Side-chaining

#### Input chunking / buffering, controlled by sidechain

Source: [sidechainPartition()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/sidechain-partition.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sidechain-partition.png)

Buffers values from `src` until side chain fires, then emits buffer
(unless empty) and repeats process until either input is done. By
default, the value read from the side chain is ignored, however the
optional predicate can be used to only trigger for specific values /
conditions.

```ts
// merge various event streams
merge([
    fromEvent(document, "mousemove"),
    fromEvent(document, "mousedown"),
    fromEvent(document, "mouseup")
])
    // queue event processing to only execute during the
    // requestAnimationFrame cycle (RAF)
    .subscribe(sidechainPartition(fromRAF()))
    .subscribe(trace());
```

#### Input toggling, controlled by sidechain

Source: [sidechainToggle()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/sidechain-toggle.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sidechain-toggle.png)

Filters values from input based on values received from side chain. By
default, the value read from the side chain is ignored, however the
optional predicate can be used to only trigger for specific
values/conditions. Every time the predicate fn returns true, the filter
will be toggled on/off. Whilst switched off, no input values will be
forwarded.

```ts
// use slower interval stream to toggle main stream on/off
fromInterval(500)
  .subscribe(sidechainToggle(fromInterval(1000)))
  .subscribe(trace());
// 0
// 3
// 4
// 7
// 8
...
```

### Worker support

#### Parallel stream processing via workers

Source: [forkJoin()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/forkjoin.ts)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-forkjoin.png)

##### worker.ts

```ts
const $self: Worker = <any>self;
self.addEventListener("message", (e) => {
    const { buf, factor } = e.data;
    $self.postMessage(buf.map((x) => x * factor));
});
```

##### main.ts

```ts
const src = stream<number[]>();

// fork worker jobs & re-join results
forkJoin({
    src: src,
    // worker job preparation
    // this function is called for each worker ID and the results
    // of that function are the messages sent to the workers...
    fork: (id, numWorkers, buf) => {
        const size = (buf.length / numWorkers) | 0;
        return {
            buf: id < numWorkers - 1
                    ? buf.slice(id * size, (id + 1) * size)
                    : buf.slice(id * size),
            factor: id * 10
        };
    },
    // re-join worker results
    join: (parts) => <number[]>Array.prototype.concat.apply([], parts),
    // worker script
    worker: "./worker.js",
    // default: navigator.hardwareConcurrency
    numWorkers: 4
}).subscribe(trace("results"));

src.next(new Array(16).fill(1));

// result: [0, 0, 0, 0, 10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30]
```

#### Stream processing via workers

Source: [tunnel()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/tunnel.ts)

Delegate stream value processing to workers and pass on their responses
to downstream subscriptions. Supports multiple worker instances and
worker termination / restart for each new stream value received.

Source: [postWorker()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/post-worker.ts)

Send values to workers (incl. optional (inline) worker instantiation)

Source: [fromWorker()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/from/worker.ts)

Create value stream from worker messages.

### Other subscription ops

- [debounce](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/debounce.ts) - ignore high frequency interim values
- [resolve](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/resolve.ts) - resolve on-stream promises
- [trace](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/trace.ts) - debug helper
- [transduce](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/subs/transduce.ts) - transduce or just reduce an entire stream into a promise
- [tween](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream/src/tween.ts) - stream interpolation

## Authors

### Maintainer

- Karsten Schmidt ([@postspectacular](https://github.com/postspectacular))

### Contributors

- André Wachter ([@andrew8er](https://github.com/andrew8er))
- Gavin Cannizzaro ([@gavinpc-mindgrub](https://github.com/gavinpc-mindgrub))

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-rstream,
  title = "@thi.ng/rstream",
  author = "Karsten Schmidt and others",
  note = "https://thi.ng/rstream",
  year = 2017
}
```

## License

&copy; 2017 - 2020 Karsten Schmidt // Apache Software License 2.0
