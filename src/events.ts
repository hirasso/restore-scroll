import type { EventMap, Handlers, ScrollPosition, Settings } from "./defs.js";

const domPrefix = "restore-scroll";

/**
 * Dispatch an event, both via the handlers option as well as the element itself
 */
export function dispatch<K extends keyof EventMap>(
  el: Element,
  type: K,
  detail: EventMap[K]["detail"],
  settings: Settings
): boolean {
  const event = new CustomEvent(`${domPrefix}:${type}`, {
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

/**
 * Add a typed listener
 */
export function addListener<K extends keyof EventMap>(
  el: Element,
  type: K,
  listener: (ev: EventMap[K]) => void
) {
  el.addEventListener(`${domPrefix}:${type}`, listener as EventListener);
}
