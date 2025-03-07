<!-- This file is generated - DO NOT EDIT! -->

# ![interceptors](https://media.thi.ng/umbrella/banners/thing-interceptors.svg?4a03c1f3)

[![npm version](https://img.shields.io/npm/v/@thi.ng/interceptors.svg)](https://www.npmjs.com/package/@thi.ng/interceptors)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/interceptors.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
- [Event bus, interceptors, side effects](#event-bus--interceptors--side-effects)
  - [Interceptors: Event and Effect primitives](#interceptors--event-and-effect-primitives)
  - [Event Handlers](#event-handlers)
    - [Events vs Effects:](#events-vs-effects)
  - [Great, but why?](#great--but-why)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
  - [Maintainer](#maintainer)
  - [Contributors](#contributors)
- [License](#license)

## About

Interceptor based event bus, side effect & immutable state handling.

## Event bus, interceptors, side effects

### Interceptors: Event and Effect primitives

[Reference](https://github.com/thi-ng/umbrella/blob/develop/packages/interceptors/src/interceptors.ts)

The idea of interceptors is quite similar to functional composition and
AOP ([aspect oriented
programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)).
You want to reuse some functionality across components within your app.
For example, if you have multiple actions which should be undoable, you
can compose your main event handlers with the
[`snapShot()`](https://github.com/thi-ng/umbrella/blob/develop/packages/interceptors/src/interceptors.ts#L55)
interceptor, which requires a
[@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom)/History-like
instance and records a snapshot of the current app state, but else is
completely invisible.

```
[UNDOABLE_EVENT]: [snapshot(), valueSetter("foo")]
```

### Event Handlers

The idea of **event** handlers is being responsible to assign parameters
to side effects, rather than executing effects *themselves*, is again
mainly to do with the DRY-principle, instrumentation potential and
performance. Most composed event handler chains are setup so that your
"actual" main handler is last in line in the pre processing phase. If
e.g. your event handlers would directly update the state atom, then any
attached watches [(derived views, cursors, other
subscriptions)](https://github.com/thi-ng/umbrella/tree/develop/packages/atom#about)
would be re-run each time. By assigning the updated state to, e.g., an
`FX_STATE` event, we can avoid these interim updates and only apply the
new state once all events in the current frame have been processed.
Furthermore, a post interceptor might cancel the event due to validation
errors etc.

#### Events vs Effects:

To briefly summarize the differences between event handlers & effects:

Event handlers are triggered by events, but each event handler is
technically a chain of interceptors (even though many are just a single
item). Even if you just specify a single function, it's internally
translated into an array of interceptor objects like:

```
valueSetter("route") -> [{ pre: (...) => {[FX_STATE]: ...}, post: undefined }]
```

When processing an event, these interceptors are then executed first in
ascending order for any `pre` functions and then backwards again for any
`post` functions (only if there are any in the chain). So if you had
defined an handler with this chain: `[{pre: f1, post: f2}, {pre: f3},
{pre: f4, post: f5}]`, then the functions would be called in this order:
f1, f3, f4, f5, f2. The post phase is largely intended for state/effect
validation & logging post-update. I.e., interceptors commonly need `pre`
only.

Like with
[`trace()`](https://github.com/thi-ng/umbrella/blob/develop/packages/interceptors/src/interceptors.ts#L21)
some interceptors DO have side effects, but they're really the exception
to the rule. For example, `snapshot()` is idempotent since it only
records a new snapshot if it's different from the last and `trace()`,
but is typically used during development only - its side effect is
outside the scope of your app (i.e. the console).

### Great, but why?

In most apps there're far more event types/handlers than possible
actions any component can take. So assigning them to registered side
effects enables better code reuse. Another use-case is debugging. With a
break point set at the beginning of `processEffects()` (in
[`event-bus.ts`](https://github.com/thi-ng/umbrella/blob/develop/packages/interceptors/src/event-bus.ts#L36))
you can see exactly which side effects have occurred at each frame. This
can be very helpful for debugging and avoid having to "keep everything
in your head" or - as Rich Hickey would say - make your app "Easier to
reason about".

More comprehensive description forthcoming. Please check the detailed
commented source code and examples for now:

- [/src/event-bus.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/interceptors/src/event-bus.ts)

### Status

**STABLE** - used in production

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Binterceptors%5D+in%3Atitle)

## Installation

```bash
yarn add @thi.ng/interceptors
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/interceptors?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/interceptors/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 2.17 KB / CJS: 2.30 KB / UMD: 2.27 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)
- [@thi.ng/paths](https://github.com/thi-ng/umbrella/tree/develop/packages/paths)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

| Screenshot                                                                                                           | Description                                                            | Live demo                                                 | Source                                                                                 |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
|                                                                                                                      | Minimal demo using interceptors with an async side effect              | [Demo](https://demo.thi.ng/umbrella/async-effect/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/async-effect)        |
|                                                                                                                      | Custom dropdown UI component w/ fuzzy search                           | [Demo](https://demo.thi.ng/umbrella/hdom-dropdown-fuzzy/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-dropdown-fuzzy) |
|                                                                                                                      | Event handling w/ interceptors and side effects                        | [Demo](https://demo.thi.ng/umbrella/interceptor-basics/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/interceptor-basics)  |
|                                                                                                                      | Event handling w/ interceptors and side effects                        | [Demo](https://demo.thi.ng/umbrella/interceptor-basics2/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/interceptor-basics2) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/router-basics.jpg" width="240"/> | Complete mini SPA app w/ router & async content loading                | [Demo](https://demo.thi.ng/umbrella/router-basics/)       | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/router-basics)       |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rstream-grid.jpg" width="240"/>  | Interactive grid generator, SVG generation & export, undo/redo support | [Demo](https://demo.thi.ng/umbrella/rstream-grid/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rstream-grid)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/svg-waveform.jpg" width="240"/>  | Additive waveform synthesis & SVG visualization with undo/redo         | [Demo](https://demo.thi.ng/umbrella/svg-waveform/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/svg-waveform)        |

## API

[Generated API docs](https://docs.thi.ng/umbrella/interceptors/)

TODO

## Authors

### Maintainer

- Karsten Schmidt ([@postspectacular](https://github.com/postspectacular))

### Contributors

- Logan Powell ([@loganpowell](https://github.com/loganpowell))

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-interceptors,
  title = "@thi.ng/interceptors",
  author = "Karsten Schmidt and others",
  note = "https://thi.ng/interceptors",
  year = 2016
}
```

## License

&copy; 2016 - 2020 Karsten Schmidt // Apache Software License 2.0
