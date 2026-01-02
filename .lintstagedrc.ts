export default {
  "**/*.{ts}": [
    "prettier --write",
    /**
     * Fixes an issue where lint-staged ignores tsconfig.json when it called through husky hooks
     * @see https://github.com/lint-staged/lint-staged/issues/825#issuecomment-620018284
     */
    () => "pnpm run analyse",
  ],
};
