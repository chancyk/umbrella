<!-- This file is generated - DO NOT EDIT! -->

# ![scenegraph](https://media.thi.ng/umbrella/banners/thing-scenegraph.svg?af3d7fd5)

[![npm version](https://img.shields.io/npm/v/@thi.ng/scenegraph.svg)](https://www.npmjs.com/package/@thi.ng/scenegraph)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/scenegraph.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Usage examples](#usage-examples)
- [API](#api)
- [Authors](#authors)
- [License](#license)

## About

Extensible 2D/3D scene graph with [@thi.ng/hiccup-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas) support.

### Status

**ALPHA** - bleeding edge / work-in-progress

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bscenegraph%5D+in%3Atitle)

## Installation

```bash
yarn add @thi.ng/scenegraph
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/scenegraph?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/scenegraph/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 900 bytes / CJS: 938 bytes / UMD: 1.03 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/matrices](https://github.com/thi-ng/umbrella/tree/develop/packages/matrices)
- [@thi.ng/vectors](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors)

## Usage examples

Several demos in this repo's
[/examples](https://github.com/thi-ng/umbrella/tree/develop/examples)
directory are using this package.

A selection:

| Screenshot                                                                                                              | Description                                           | Live demo                                              | Source                                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/scenegraph.png" width="240"/>       | 2D scenegraph & shape picking                         | [Demo](https://demo.thi.ng/umbrella/scenegraph/)       | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/scenegraph)       |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/scenegraph-image.png" width="240"/> | 2D scenegraph & image map based geometry manipulation | [Demo](https://demo.thi.ng/umbrella/scenegraph-image/) | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/scenegraph-image) |
| <img src="https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/shader-graph.jpg" width="240"/>     | Minimal shader graph developed during livestream #2   | [Demo](https://demo.thi.ng/umbrella/shader-graph/)     | [Source](https://github.com/thi-ng/umbrella/tree/develop/examples/shader-graph)     |

## API

[Generated API docs](https://docs.thi.ng/umbrella/scenegraph/)

TODO

## Authors

Karsten Schmidt

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-scenegraph,
  title = "@thi.ng/scenegraph",
  author = "Karsten Schmidt",
  note = "https://thi.ng/scenegraph",
  year = 2016
}
```

## License

&copy; 2016 - 2020 Karsten Schmidt // Apache Software License 2.0
