import type { ScrollPosition } from "../../../src/defs.ts";

export function showDebugInfo(
  event: "stored" | "restored",
  el: Element,
  { top, left }: ScrollPosition,
) {
  const info =
    el.parentElement?.querySelector<HTMLElement>("[data-debug-info]") ||
    document.querySelector<HTMLElement>("[data-global-debug-info]");

  if (!info) return;

  info.style.display = "block";
  info.textContent = `${event}: {top: ${top}, left: ${left}}`;
}
