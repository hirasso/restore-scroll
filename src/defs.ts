import { createLogger } from "./helpers.js";

export type Options = {
  debug: boolean;
  events?: Handlers;
};

export const SCROLL_DEBOUNCE_MS = 150;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Settings = Prettify<
  Omit<Options, "debug"> & {
    logger?: Logger;
  }
>;

export type ScrollPosition = {
  top: number;
  left: number;
};

export type ScrollState = Record<string, ScrollPosition>;

export type Target = Element | Window;

export type Logger = ReturnType<typeof createLogger>;

export type ScrollContainer = Element & {
  __restore_scroll?: {
    selector: string;
  };
};

export type EventMap = {
  store: CustomEvent<{ position: ScrollPosition }>;
  restore: CustomEvent<{ position: ScrollPosition }>;
};

export type Handlers = {
  [K in keyof EventMap]?: (el: Element, event: EventMap[K]) => void;
};
