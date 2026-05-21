import { SITE } from "./config";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		author: z.string().default(SITE.author),
		title: z.string(),
		publishedTime: z.date()
	})
});

export const collections = { blog };
