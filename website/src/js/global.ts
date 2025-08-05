import type { ScrollPosition } from "../../../src/defs.ts";
import { createToast } from "./helpers.ts";

const toast = createToast();

export function showDebugInfo(
  el: Element,
  event: CustomEvent<{ position: ScrollPosition }>
) {
  const { position } = event.detail;
  const top = Math.round(position.top);
  const left = Math.round(position.left);
  const type = event.type.replace(/^(.*?):/, "");
  const info =
    el.parentElement?.querySelector<HTMLElement>("[data-debug-info]") ||
    document.querySelector<HTMLElement>("[data-global-debug-info]");

  if (!info) return;

  info.style.display = "block";

  info.innerHTML =
    type === "restore"
      ? `${type}d: {top: ${top}, left: ${left}}`
      : `${type}d: {top: ${top}, left: ${left}} – go back and fourth or reload to restore`;
}
