import Swup from "swup";
import Theme from "@swup/fade-theme";
import { restoreScroll } from "../../../src/index.js";
import { showDebugInfo } from "./global.js";

window.history.scrollRestoration = "auto";

function initPage() {
  restoreScroll(".overflow-y-auto,.overflow-x-auto,.overflow-auto", {
    debug: true,
    onStore: (el, position) => showDebugInfo("stored", el, position),
    onRestore: (el, position) => showDebugInfo("restored", el, position),
  });
}

initPage();

new Swup({
  containers: ["#header", "#swup"],
  plugins: [new Theme()],
  hooks: {
    "page:view": initPage,
  },
  ignoreVisit: (url) => !url.startsWith("/spa-"),
});
