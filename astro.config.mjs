import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import { satteri } from "@astrojs/markdown-satteri";
import partytown from "@astrojs/partytown";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: "https://sshear.dev",
	integrations: [
		tailwind(),
		react(),
		robotsTxt(),
		sitemap(),
		compressor(),
		partytown({ config: { forward: ["dataLayer.push"] } })
	],
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
	})
});
