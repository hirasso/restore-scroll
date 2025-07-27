import { createLogger } from "./helpers.js";

export type Options = {
  debug: boolean;
};

export type ScrollPosition = {
  top: number;
  left: number;
};

export type ScrollState = Record<string, ScrollPosition>;

export type Target = Window | Element | NodeListOf<Element> | Element[];

export type Logger = ReturnType<typeof createLogger>;

export type ScrollContainer = Element & {
  __restore_scroll?: {
    selector?: string;
  };
}