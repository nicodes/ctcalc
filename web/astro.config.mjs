import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vercelServerless from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercelServerless(),
  integrations: [svelte()],
});
