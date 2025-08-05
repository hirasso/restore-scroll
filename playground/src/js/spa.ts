import Swup from "swup";
import Theme from "@swup/fade-theme";
import { restoreScroll } from "../../../src/index.js";
import { showDebugInfo } from "./global.js";
import { $$ } from "./helpers.js";

window.history.scrollRestoration = "auto";

function initPage() {
  $$(".overflow-y-auto,.overflow-x-auto,.overflow-auto").forEach((el) => {
    restoreScroll(el, {
      debug: true,
      events: {
        restore: showDebugInfo,
        store: showDebugInfo,
      },
    });
  });
}

initPage();

new Swup({
  containers: ["#header", "main"],
  plugins: [new Theme()],
  hooks: {
    "page:view": initPage,
  },
  ignoreVisit: (url) => !url.startsWith("/spa-"),
});
