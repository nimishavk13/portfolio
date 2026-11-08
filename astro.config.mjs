import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://nimisha-vk.vercel.app",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
});
