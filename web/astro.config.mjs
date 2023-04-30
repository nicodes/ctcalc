import { defineConfig } from "astro/config";
import deno from "@astrojs/deno";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: deno(),
  integrations: [svelte()]
});