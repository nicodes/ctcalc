import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vercelStatic from "@astrojs/vercel/static";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: !!process.env.NODE_ADAPTER
    ? node({
        mode: "standalone",
      })
    : vercelStatic(),
  integrations: [svelte()],
});
