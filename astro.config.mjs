import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://geraldpameole.fr",
  integrations: [mdx(), tailwind(), react(), icon()],
  server: {
    host: true,
    port: 3000,
  },
  vite: {
    server: {
      hmr: {
        timeout: 60000,
      },
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
    css: {
      postcss: {
        // Ignorer les fichiers Astro dans PostCSS
        exclude: ['**/*.astro'],
      },
    },
  },
});
