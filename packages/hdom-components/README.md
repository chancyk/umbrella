<!-- This file is generated - DO NOT EDIT! -->

# ![hdom-components](https://media.thi.ng/umbrella/banners/thing-hdom-components.svg?383f0ac7)

[![npm version](https://img.shields.io/npm/v/@thi.ng/hdom-components.svg)](https://www.npmjs.com/package/@thi.ng/hdom-components)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/hdom-components.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
  - [Canvas](#canvas)
  - [Form elements](#form-elements)
  - [Links](#links)
  - [Other](#other)
- [Authors](#authors)
- [License](#license)

## About

Raw, skinnable UI & SVG components for [@thi.ng/hdom](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom).

A growing collection of unstyled, re-usable & customizable components
for use with
[@thi.ng/hdom](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom)
&
[@thi.ng/hiccup](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup).

**Please see
[ADR-0002](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/adr/0002-component-configuration.md)
and onwards for detailed discussion about the design intentions of these
components**. Feedback welcome!

### Status

**BETA** - possibly breaking changes forthcoming

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bhdom-components%5D+in%3Atitle)

## Installation

```bash
yarn add @thi.ng/hdom-components
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/hdom-components?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/hdom-components/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 2.20 KB / CJS: 2.32 KB / UMD: 2.35 KB

## Dependencies

- [@thi.ng/adapt-dpi](https://github.com/thi-ng/umbrella/tree/develop/packages/adapt-dpi)
- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/math](https://github.com/thi-ng/umbrella/tree/develop/packages/math)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)
- [@thi.ng/transducers-stats](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers-stats)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

| Screenshot                                                                                                                           | Description                                                            | Live demo                                                 | Source                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/canvas-dial.png" width="240"/>                   | Canvas based dial widget                                               | [Demo](https://demo.thi.ng/umbrella/canvas-dial/)         | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/canvas-dial)         |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/crypto-chart.png" width="240"/>                  | Basic crypto-currency candle chart with multiple moving averages plots | [Demo](https://demo.thi.ng/umbrella/crypto-chart/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/crypto-chart)        |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/hdom-benchmark2.png" width="240"/>               | hdom update performance benchmark w/ config options                    | [Demo](https://demo.thi.ng/umbrella/hdom-benchmark2/)     | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-benchmark2)     |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/hdom-canvas/hdom-canvas-shapes-results.png" width="240"/> | Various hdom-canvas shape drawing examples & SVG conversion / export   | [Demo](https://demo.thi.ng/umbrella/hdom-canvas-shapes/)  | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-canvas-shapes)  |
|                                                                                                                                      | Custom dropdown UI component w/ fuzzy search                           | [Demo](https://demo.thi.ng/umbrella/hdom-dropdown-fuzzy/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-dropdown-fuzzy) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/hdom-toggle.png" width="240"/>                   | Customizable slide toggle component demo                               | [Demo](https://demo.thi.ng/umbrella/hdom-toggle/)         | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/hdom-toggle)         |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/mandelbrot.jpg" width="240"/>                    | Worker based, interactive Mandelbrot visualization                     | [Demo](https://demo.thi.ng/umbrella/mandelbrot/)          | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/mandelbrot)          |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/triple-query.png" width="240"/>                  | Triple store query results & sortable table                            | [Demo](https://demo.thi.ng/umbrella/triple-query/)        | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/triple-query)        |

## API

[Generated API docs](https://docs.thi.ng/umbrella/hdom-components/)

### Canvas

- [Canvas types](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/canvas.ts) (WebGL, WebGL2 & Canvas2D)

### Form elements

- [Button](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/button.ts)
- [Button group](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/button-group.ts)
- [Dropdown](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/dropdown.ts)
- [Pager](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/pager.ts)

### Links

- [Link types](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/link.ts)

### Other

- [FPS counter](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/fps-counter.ts)
- [Notification](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/notification.ts)
- [Sparkline](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/sparkline.ts)
- [Title](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom-components/src/title.ts)

## Authors

Karsten Schmidt

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-hdom-components,
  title = "@thi.ng/hdom-components",
  author = "Karsten Schmidt",
  note = "https://thi.ng/hdom-components",
  year = 2018
}
```

## License

&copy; 2018 - 2020 Karsten Schmidt // Apache Software License 2.0
