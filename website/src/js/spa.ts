import Swup from "swup";
import Theme from "@swup/fade-theme";
import SwupMorphPlugin from "swup-morph-plugin";
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
  containers: ["#swup"],
  plugins: [new Theme({ mainElement: "#swup" }), new SwupMorphPlugin()],
  hooks: {
    "page:view": initPage,
    "visit:start": (visit) => {
      visit.scroll.reset = false;
    },
  },
  ignoreVisit: (url) => !url.startsWith("/spa-"),
});
