const inBrowser = window instanceof Window;

const nodeEnv = inBrowser ? "" : String(process?.env?.NODE_ENV ?? "");

/**
 * Export environment variables. This will become false in production builds from consumers
 */
export const __TEST__ = ["test"].includes(nodeEnv);
export const __DEV__ = ["development", "test"].includes(nodeEnv);
