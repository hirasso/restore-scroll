# @hirasso/restore-scroll

**Zero-dependency scroll restoration for window and scrollable elements using `history.state` ♻️**

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

```js
/**
 * Store the scroll position all overflowing divs (identified by tailwind classes in this case):
 */
document.querySelectorAll(".overflow-y-auto,.overflow-x-auto,.overflow-auto").forEach(restoreScroll);
```

💡 If `history.scrollRestoration` is set to `manual`, you might want to restore the `:root` scroll position as well:

```js
window.history.scrollRestoration = "manual";
restoreScroll(window);
```

## Arguments

The first argument `target` accepts either an element or the `Window`:

```ts
export type Target = Element | Window;
```

The second argument `options` accepts this:

```ts
type Options = {
  debug: boolean;
  events?: {
    "store"?: (el: Element, event: CustomEvent<position: ScrollPosition>) => void,
    "restore"?: (el: Element, event: CustomEvent<position: ScrollPosition>) => void,
  }
}
```

## Options

### `debug`

Type: `boolean`, default: `false`. Log debug info to the console

## Events

Listening to events can be done in two ways:

### Attach listeners declaratively

```ts
import { restoreScroll } from "@hirasso/restore-scroll";
restoreScroll(el, {
  events: {
    store: (el, event) => console.log("stored", el, event),
    restore: (el, event) => console.log("restored", el, event),
  },
});
```

### Attach listeners to the element directly

DOM Events are prefixed `restore-scroll:`:

```ts
import { restoreScroll } from "@hirasso/restore-scroll";
const el = document.querySelector("#foo");
el.addEventListener("restore-scroll:restore", (e) => {
  const event = e as CustomEvent<{ position: ScrollPosition }>;
  console.log(event.detail.position);
});
restoreScroll(el);
```

You can prevent events from executing by calling `event.preventDefault`:

```ts
restoreScroll(el, {
  events: {
    restore: (el, event) => {
      if (someCondition()) {
        /** The element won't be restored */
        event.preventDefault();
      }
    },
  },
});
```
