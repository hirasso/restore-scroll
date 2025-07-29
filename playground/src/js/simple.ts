import { restoreScroll } from "../../../src/index.js";

window.history.scrollRestoration = "manual";
restoreScroll(":root,.overflow-y-auto,.overflow-x-auto,.overflow-auto", {
  debug: true,
});
