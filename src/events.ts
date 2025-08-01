import type { EventMap, Settings } from "./defs.js";

import { prefix } from "./helpers.js";

/**
 * Dispatch an event:
 *  - via the "events" option
 *  - prefixed with "restore-scroll:{eventName}" on the element itself
 */
export function dispatch<K extends keyof EventMap>(
  el: Element,
  type: K,
  detail: EventMap[K]["detail"],
  settings: Settings
): boolean {
  const event = new CustomEvent(`${prefix}:${type}`, {
    detail,
    cancelable: true,
  }) as EventMap[K];

  // Dispatch native event first, so native listeners get first chance
  const dispatched = el.dispatchEvent(event);

  // Call the handler callback after
  settings.events?.[type]?.(el, event);

  // Return false if default was prevented by either
  return !event.defaultPrevented && dispatched;
}