import catppuccin from "@catppuccin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		animation: {
			type: "type 1.2s ease-out .4s infinite alternate both",
			cursor: "cursor .4s linear infinite alternate"
		},
		keyframes: {
			type: {
				"0%": { width: "0ch" },
				"5%, 10%": { width: "1ch" },
				"15%, 20%": { width: "2ch" },
				"25%, 30%": { width: "3ch" },
				"35%, 40%": { width: "4ch" },
				"45%, 50%": { width: "5ch" },
				"55%, 60%": { width: "6ch" },
				"65%, 70%": { width: "7ch" },
				"75%, 80%": { width: "8ch" },
				"85%, 90%": { width: "9ch" },
				"95%": { width: "10ch" }
			},
			cursor: {
				"0%, 40%": { opacity: "0.1" },
				"60%, 100%": { opacity: "1" }
			}
		}
	},
	plugins: [
		catppuccin({
			prefix: "ctp"
		})
	]
};
