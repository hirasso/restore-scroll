# Changelog

## 0.1.4

### Patch Changes

- 6ddf805: Compile only to esm
- 6ddf805: Switch from microbundle to tsdown for building the library

## 0.1.3

### Patch Changes

- a0f5f45: Allow repeated calls to `restoreScroll` against the same target element to make it easier to restore the `window` scroll position in single page apps.

## 0.1.2

### Patch Changes

- 8ef0fa0: Bump version to update README on npmjs.org

## 0.1.1

### Patch Changes

- b9ec453: Allow elements to be restored if only one axis has a length `> 0`
- ccd6d25: Cleanup and more tests

## 0.1.0

### Minor Changes

- 91e555c:

  **Breaking Change**

  Only allow `Element` or `Window` when calling `restoreScroll`. This simplifies the internals significantly.

### Patch Changes

- 9f418d1: Dispatch cancellable events: "scroll:store" and "scroll:restore"
- c8e8945: Add a cancelable event interface
- 91e555c: Update Documentation

## 0.0.1

### Patch Changes

- b8bcb73: Initial Release
