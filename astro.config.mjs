import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
	site: "https://localhost:4321",
	integrations: [tailwind(), react(), robotsTxt(), sitemap(), compressor()],
	markdown: {
		shikiConfig: {
			themes: {
				light: "catppuccin-latte",
				dark: "catppuccin-mocha"
			}
		}
	}
});
