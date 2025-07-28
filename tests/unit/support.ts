import { ScrollState } from "../../src/defs.ts";

/**
 * Create an element from a HTML string
 */
export function createElement<T extends Element>(html: string): T {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild as T;
}

/**
 * Wait for a given amount of milliseconds
 */
export function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
