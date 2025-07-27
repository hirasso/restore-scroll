import { createLogger } from "./helpers.js";

export type Options = {
  debug: boolean;
};

export type ScrollPosition = {
  top: number;
  left: number;
  debug: boolean;
};

export type ScrollMemory = Record<string, ScrollPosition>;

export type Target = Window | Element | NodeListOf<Element> | Element[];

export type Logger = ReturnType<typeof createLogger>;

export type AugmentedElement = Element & {
  __scrollmemory: {
    selector?: string;
    position?: ScrollPosition;
  };
};
