// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://blorc.netlify.app",
  output: "server",
  adapter: netlify({
    edgeMiddleware: true,
  }),
});
