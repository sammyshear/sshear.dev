import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import { satteri } from "@astrojs/markdown-satteri";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	//site: "https://sshear.dev",
	integrations: [react(), robotsTxt(), sitemap(), compressor()],

	markdown: {
		shikiConfig: {
			themes: {
				light: "catppuccin-latte",
				dark: "catppuccin-mocha"
			},
			wrap: true
		},
		processor: satteri({
			features: { directive: true, definitionList: true }
		})
	},

	output: "server",

	adapter: node({
		mode: "standalone"
	}),

	vite: {
		plugins: [tailwindcss()]
	}
});

