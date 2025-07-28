# @hirasso/restore-scroll

**Restore the scroll position of the window and overflowing divs from the history state ♻️**

[![e2e test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/e2e-tests.yml?branch=main&label=e2e%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/e2e-tests.yml)
[![unit test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/unit-tests.yml?branch=main&label=unit%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/unit-tests.yml)
[![weekly NPM downloads](https://img.shields.io/npm/dw/restore-scroll)](https://www.npmjs.com/package/restore-scroll)
[![license](https://img.shields.io/github/license/hirasso/restore-scroll)](https://github.com/hirasso/restore-scroll/blob/main/LICENSE)

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
 * Store the scroll position all overflowing divs (identified by tailwind classes in this case):
 */
restoreScroll(
  document.querySelectorAll(".overflow-y-auto,.overflow-x-auto,.overflow-auto")
);
```

<!--See also this [minimal example on CodePen](https://codepen.io/rassohilber/pen/JjxwJpo)-->

💡 If `history.scrollRestoration` is set to `manual`, you might want to restore the `:root` scroll position as well:

```js
window.history.scrollRestoration = "manual";
restoreScroll(
  document.querySelectorAll(
    ":root,.overflow-y-auto,.overflow-x-auto,.overflow-auto"
  )
);
```

## Options

You can pass in options to restoreScroll as the second argument:

```js
restoreScroll(document.querySelectorAll(".overflow-y-auto"), options);
```

The type signature of the options object:

```js
type Options = {
  debug: boolean;
}
```

### `debug`

Type: `boolean`, default: `false`. Log debug info to the console
