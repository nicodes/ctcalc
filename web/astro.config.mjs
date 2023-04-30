import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: !!process.env.NODE_ADAPTER
    ? node({
        mode: "standalone",
      })
    : vercel(),
  integrations: [svelte()],
});
