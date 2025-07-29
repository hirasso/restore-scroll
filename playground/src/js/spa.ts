import Swup from "swup";
import Theme from "@swup/fade-theme";
import { restoreScroll } from "../../../src/index.js";

window.history.scrollRestoration = "manual";
restoreScroll(":root");

function restore() {
  restoreScroll(".overflow-y-auto,.overflow-x-auto,.overflow-auto", {
    debug: true,
  });
}

restore();

new Swup({
  containers: ["#header", "#swup"],
  plugins: [new Theme()],
  hooks: {
    "page:view": restore,
  },
  ignoreVisit: (url) => !url.startsWith("/spa-"),
});
