import { createLogger } from "./helpers.js";

export type Options = {
  debug: boolean;
  onStore: (el: Element, position: ScrollPosition) => void;
  onRestore: (el: Element, position: ScrollPosition) => void;
};

export type Settings = Options & {
  logger?: Logger;
};

export type ScrollPosition = {
  top: number;
  left: number;
};

export type ScrollState = Record<string, ScrollPosition>;

export type Target =
  | string
  | Window
  | Element
  | NodeListOf<Element>
  | Element[];

export type Logger = ReturnType<typeof createLogger>;

export type ScrollContainer = Element & {
  __restore_scroll?: {
    selector?: string;
  };
};
