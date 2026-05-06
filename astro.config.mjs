import mdx     from "@astrojs/mdx";
import react   from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://geraldpameole.fr",
  integrations: [mdx(), tailwind(), react()],
  server: {
    host: true,
    port: 3000,
  },
});
