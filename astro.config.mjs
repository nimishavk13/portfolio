import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://nimishavk-portfolio.vercel.app",
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
});
