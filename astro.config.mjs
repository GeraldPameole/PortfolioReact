import mdx      from "@astrojs/mdx";
import react    from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap  from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://geraldpameole.fr",
  integrations: [mdx(), tailwind(), react(), sitemap()],
  server: {
    host: true,
    port: 3000,
  },
});
