import { nextTick } from "swup";

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

/**
 * Create an element from a HTML string
 */
export const createElement = <T extends HTMLElement = HTMLElement>(
  html: string,
) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.children[0].cloneNode(true) as T;
};

/**
 * Create a toast
 */
export function createToast() {
  let hideTimeout: ReturnType<typeof window.setTimeout> | undefined;

  const element = createElement(/*html*/ `
      <div class="fixed px-4 py-2 bottom-8 left-1/2 -translate-x-1/2
          z-100 rounded-lg bg-emerald-200 text-sm text-black pointer-events-none
          border border-black/50 shadow-black/20 shadow-lg
          transition-all duration-75 ease-out">
      </div>
    `);

  document.body.append(element);

  const hide = () => {
    element.classList.add("translate-y-3", "opacity-0");
  };

  const show = async (html: string, { persist = false } = {}) => {
    clearTimeout(hideTimeout);
    await nextTick();
    element.innerHTML = html;
    element.classList.remove("translate-y-3", "opacity-0");
    if (!persist) {
      hideTimeout = setTimeout(hide, 2000);
    }
  };

  hide();

  return { show, hide };
}
