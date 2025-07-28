# @hirasso/restore-scroll

**Store and restore the scroll positions of the window and overflowing divs between page reloads ♻️**

[![e2e test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/e2e-tests.yml?branch=main&label=e2e%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/e2e-tests.yml)
[![unit test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/unit-tests.yml?branch=main&label=unit%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/unit-tests.yml)
[![weekly NPM downloads](https://img.shields.io/npm/dw/restore-scroll)](https://www.npmjs.com/package/restore-scroll)
[![license](https://img.shields.io/github/license/hirasso/restore-scroll)](https://github.com/hirasso/restore-scroll/blob/master/LICENSE)

<!--## Demo

[restore-scroll.js.org](https://restore-scroll.js.org)-->

## Installation

Install the plugin from npm and import it into your bundle:

```bash
npm i restore-scroll
```

```js
import { restoreScroll } from "restore-scroll";
```

Or include the minified production file from a CDN:

```html
<script src="https://unpkg.com/restore-scroll"></script>
```

## Usage Example

```js
import { restoreScroll } from "restore-scroll";
/**
 * Store the scroll position of the window (=:root) and all overflowing
 * divs (tailwind classes in this case):
 */
restoreScroll(
  document.querySelectorAll(
    ":root,.overflow-y-auto,.overflow-x-auto,.overflow-auto"
  )
);
```

See also this [minimal example on CodePen](https://codepen.io/rassohilber/pen/JjxwJpo)

💡 If `history.scrollRestoration` is set to `manual`, you might want to restore the `window` scroll position as well:

```js
window.history.scrollRestoration = 'manual';
restoreScroll(window);
restoreScroll(document.querySelectorAll(".overflow-y-auto,.overflow-x-auto,.overflow-auto"));
```

## Options

You can pass in options to restoreScroll as the second argument:

```js
restoreScroll(document.querySelectorAll(".scroller"), options);
```

The type signature of the options object:

```js
type Options = {
  debug: boolean;
}
```

### `debug`

Type: `boolean`, default: `false`. Should debug messages be printed to the console?

## Motivation

There are already a few libraries out there that do the same thing. But all I could find had some limitations (For example, [react-scroll-sync](https://github.com/okonet/react-scroll-sync) needs React, [syncscroll](https://github.com/asvd/syncscroll) doesn't provide an NPM package).

Also, this simple package gave me an excuse to play around with the tooling involved with creating a robust open source `npm` package:

- The [demo page](https://restore-scroll.js.org) is generated using [Astro](https://astro.build) and deployed via [Netlify](https://www.netlify.com/)
- Browser testing is being done with [PlayWright](https://playwright.dev/), using the demo site as the source for the test fixtures
- The source code is written in [TypeScript](https://www.typescriptlang.org/)
