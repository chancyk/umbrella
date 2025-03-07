<!-- This file is generated - DO NOT EDIT! -->

# ![intervals](https://media.thi.ng/umbrella/banners/thing-intervals.svg?bccef4df)

[![npm version](https://img.shields.io/npm/v/@thi.ng/intervals.svg)](https://www.npmjs.com/package/@thi.ng/intervals)
![npm downloads](https://img.shields.io/npm/dm/@thi.ng/intervals.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/thing_umbrella.svg?style=flat-square&label=twitter)](https://twitter.com/thing_umbrella)

This project is part of the
[@thi.ng/umbrella](https://github.com/thi-ng/umbrella/) monorepo.

- [About](#about)
  - [Status](#status)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [API](#api)
- [Authors](#authors)
  - [Maintainer](#maintainer)
  - [Contributors](#contributors)
- [License](#license)

## About

Closed/open/semi-open interval data type, queries & operations.

Supports point & range queries and set operations with other intervals
(union, intersection, difference).

Furthermore, a parser for [ISO 80000-2 / ISO 31-11 interval
notation](https://en.wikipedia.org/wiki/ISO_31-11#Sets) is provided. See
[`Interval.parse()`](https://github.com/thi-ng/umbrella/blob/develop/packages/intervals/src/index.ts#L25)
for details.

### Status

**STABLE** - used in production

[Search or submit any issues for this package](https://github.com/thi-ng/umbrella/issues?q=%5Bintervals%5D+in%3Atitle)

## Installation

```bash
yarn add @thi.ng/intervals
```

```html
// ES module
<script type="module" src="https://unpkg.com/@thi.ng/intervals?module" crossorigin></script>

// UMD
<script src="https://unpkg.com/@thi.ng/intervals/lib/index.umd.js" crossorigin></script>
```

Package sizes (gzipped, pre-treeshake): ESM: 1.50 KB / CJS: 1.56 KB / UMD: 1.65 KB

## Dependencies

- [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/develop/packages/api)
- [@thi.ng/checks](https://github.com/thi-ng/umbrella/tree/develop/packages/checks)
- [@thi.ng/dlogic](https://github.com/thi-ng/umbrella/tree/develop/packages/dlogic)
- [@thi.ng/errors](https://github.com/thi-ng/umbrella/tree/develop/packages/errors)

## API

[Generated API docs](https://docs.thi.ng/umbrella/intervals/)

```ts
import { interval, Interval } from "@thi.ng/intervals";

// [0 .. +∞] (fully closed)
a = Interval.withMin(0);

// [-∞ .. 1) (open on RHS)
b = Interval.withMax(1, true);

i = a.intersection(b);
i.toString();
// [0 .. 1)

// parse from string
interval("[0 .. 1)")
// Interval { l: 0, r: 1, lopen: false, ropen: true }

i.contains(1);
// false (because interval is open on RHS)

i.contains(0.999999);
// true

// classify interval relative to point (true if RHS < x)
i.isBefore(-1)
// false

i.isBefore(1)
// true

// classify interval relative to point (true if LHS > x)
i.isAfter(-1);
// true

i.isAfter(1);
// false

// grow interval to include 2 => [0 ... 2]
i2 = i.include(2);

// sort order: LHS -> RHS
i.compare(i2);
// -1

// classify WRT given interval arg
i.classify(Interval.infinity());
// 3 (aka Classifier.SUBSET)

// create transformed interval
// (here scaled around centroid)
i.map((x) => x + (x - i.centroid()) * 2).toString();
// [-1 .. 2)

// iterator of decimated interval values
[...i.values(0.25)];
// [ 0, 0.25, 0.5, 0.75 ]

// close RHS
i.ropen = false;

[...i.values(0.25)];
// [ 0, 0.25, 0.5, 0.75, 1 ] => now includes 1

// constrain values to interval (taking openness into account)
interval("(0..1)").max(-2)
// 0.000001

// if given value is outside interval, uses opt epsilon value
// to return closest inside value (default: 1e-6)...
interval("(0..1)").max(-2, 1e-3)
// 0.001

interval("(0..1)").min(2, 1e-3)
// 0.999

// clamp on both sides
interval("[0..1)").clamp(-2, 1e-3)
// 0
interval("[0..1)").clamp(2, 1e-3)
// 0.999
```

## Authors

### Maintainer

- Karsten Schmidt ([@postspectacular](https://github.com/postspectacular))

### Contributors

- [@oljeger](https://github.com/oljeger)

If this project contributes to an academic publication, please cite it as:

```bibtex
@misc{thing-intervals,
  title = "@thi.ng/intervals",
  author = "Karsten Schmidt and others",
  note = "https://thi.ng/intervals",
  year = 2018
}
```

## License

&copy; 2018 - 2020 Karsten Schmidt // Apache Software License 2.0
