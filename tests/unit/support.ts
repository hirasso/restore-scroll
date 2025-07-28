export function createElement<T extends HTMLElement | SVGElement = HTMLElement>(
  html: string,
): T {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild as T;
}