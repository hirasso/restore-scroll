# @hirasso/restore-scroll

**Restore the scroll position of the window and overflowing divs from the history state ♻️**

[![e2e test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/e2e-tests.yml?branch=main&label=e2e%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/e2e-tests.yml)
[![unit test status](https://img.shields.io/github/actions/workflow/status/hirasso/restore-scroll/unit-tests.yml?branch=main&label=unit%20tests)](https://github.com/hirasso/restore-scroll/actions/workflows/unit-tests.yml)
[![weekly NPM downloads](https://img.shields.io/npm/dw/restore-scroll)](https://www.npmjs.com/package/restore-scroll)
[![license](https://img.shields.io/github/license/hirasso/restore-scroll)](https://github.com/hirasso/restore-scroll/blob/main/LICENSE)

<!--## Demo

[restore-scroll.js.org](https://restore-scroll.js.org)-->

## Installation

Install and import into your bundle

```bash
npm i @hirasso/restore-scroll
```

```js
import { restoreScroll } from "@hirasso/restore-scroll";
```

Or import the module directly from a CDN for quick tests:

```html
<script type="module">
  import { restoreScroll } from "https://unpkg.com/@hirasso/restore-scroll@0?module";
</script>
```

## Usage

`restoreScroll` accepts two arguments: The `target`(s) and optional `options`.

```js
/**
 * Store the scroll position all overflowing divs (identified by tailwind classes in this case):
 */
restoreScroll(".overflow-y-auto,.overflow-x-auto,.overflow-auto", {
  debug: true,
});
```

💡 If `history.scrollRestoration` is set to `manual`, you might want to restore the `:root` scroll position as well:

```js
window.history.scrollRestoration = "manual";
restoreScroll(":root,.overflow-y-auto,.overflow-x-auto,.overflow-auto");
```

## Target

The first argument accepts the following:

```ts
export type Target =
  | string
  | Window
  | Element
  | NodeListOf<Element>
  | Element[];
```

- `string` will be resolved to `document.querySelectorAll(target)`
- `Window` is the equivalent to `:root`
- `Element`
- `NodeListOf<Element>`
- `Element[]`

## Options

The type signature of the options object:

```js
type Options = {
  debug: boolean;
}
```

### `debug`

Type: `boolean`, default: `false`. Log debug info to the console
