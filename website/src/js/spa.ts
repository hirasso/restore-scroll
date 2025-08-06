import Swup from "swup";
import Theme from "@swup/fade-theme";
import SwupMorphPlugin from "swup-morph-plugin";
import { restoreScroll } from "../../../src/index.js";
import { showDebugInfo } from "./global.js";
import { $$ } from "./helpers.js";

window.history.scrollRestoration = "manual";

function restore() {
  $$(":root,.overflow-y-auto,.overflow-x-auto,.overflow-auto").forEach((el) => {
    restoreScroll(el, {
      debug: true,
      events: {
        restore: showDebugInfo,
        store: showDebugInfo,
      },
    });
  });
}
restore();

new Swup({
  plugins: [new Theme({ mainElement: "#swup" }), new SwupMorphPlugin()],
  hooks: {
    "page:view": restore,
    "visit:start": (visit) => {
      visit.scroll.reset = false;
    },
  },
  ignoreVisit: (url, { el }) =>
    !url.startsWith("/spa-") || !el?.closest("[data-swup-morph]"),
});
