<!-- This file is generated - DO NOT EDIT! -->

# ![rdom-canvas](https://media.thi.ng/umbrella/banners/thing-rdom-canvas.svg?b8ce414b)

[![npm version](https://img.shields.io/npm/v/@thi.ng/rdom-canvas.svg)](https://www.npmjs.com/package/@thi.ng/rdom-canvas)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/rdom-canvas.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
  - [Related packages](#related-packages)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

[@thi.ng/rdom](https://github.com/thi-ng/umbrella/tree/develop/packages/rdom) component wrapper for [@thi.ng/hiccup-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas) and declarative canvas drawing.

### Status

**ALPHA** - bleeding edge / work-in-progress

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Brdom-canvas%5D+in%3Atitle)

### Related packages

- [@thi.ng/hiccup-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas) - Hiccup shape tree renderer for vanilla Canvas 2D contexts
- [@thi.ng/hiccup-svg](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-svg) - SVG element functions for [@thi.ng/hiccup](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup) & [@thi.ng/hdom](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom)
- [@thi.ng/geom](https://github.com/thi-ng/umbrella/tree/develop/packages/geom) - Functional, polymorphic API for 2D geometry types & SVG generation
- [@thi.ng/scenegraph](https://github.com/thi-ng/umbrella/tree/develop/packages/scenegraph) - Extensible 2D/3D scene graph with [@thi.ng/hiccup-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas) support

## Installation

```bash
yarn add @thi.ng/rdom-canvas
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/rdom-canvas?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/rdom-canvas/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 554 bytes / CJS: 626 bytes / UMD: 745 bytes

## Dependencies

- [@thi.ng/adapt-dpi](https://github.com/thi-ng/umbrella/tree/develop/packages/adapt-dpi)
- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/hiccup-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas)
- [@thi.ng/rdom](https://github.com/thi-ng/umbrella/tree/develop/packages/rdom)
- [@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
- [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

| Screenshot                                                                                                               | Description                                             | Live demo                                               | Source                                                                               |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/ellipse-proximity.png" width="240"/> | Interactive visualization of closest points on ellipses | [Demo](https://demo.thi.ng/umbrella/ellipse-proximity/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/ellipse-proximity) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/rdom-lissajous.png" width="240"/>    | rdom & hiccup-canvas interop test                       | [Demo](https://demo.thi.ng/umbrella/rdom-lissajous/)    | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/rdom-lissajous)    |

## API

[Generated API docs](https://docs.thi.ng/umbrella/rdom-canvas/)

TODO

## Authors

Karsten Schmidt

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-rdom-canvas,
  title = "@thi.ng/rdom-canvas",
  author = "Karsten Schmidt",
  note = "https://thi.ng/rdom-canvas",
  year = 2020
}
```

## License

&copy; 2020 Karsten Schmidt // Apache Software License 2.0
