import type { ScrollPosition } from "../../../src/defs.ts";
import { createToast } from "./helpers.ts";

const toast = createToast();

export function showDebugInfo(
  el: Element,
  event: CustomEvent<{ position: ScrollPosition }>
) {
  const { top, left } = event.detail.position;
  const type = event.type.replace(/^(.*?):/, "");
  const info =
    el.parentElement?.querySelector<HTMLElement>("[data-debug-info]") ||
    document.querySelector<HTMLElement>("[data-global-debug-info]");

  if (!info) return;

  info.style.display = "block";
  info.innerHTML = `${type}d: {top: ${top}, left: ${left}}`;

  if (type === "store") {
    toast.show(`Stored the scroll position. Reload the page, it will be restored!`, {
      persist: true,
    });
  }
}

