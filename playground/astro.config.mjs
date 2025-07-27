import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  server: { port: 8274, host: false },
  vite: {
	plugins: [tailwindcss()]
  }
});
