import { SITE } from "../config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	type: "content",
	schema: z.object({
		author: z.string().default(SITE.author),
		title: z.string(),
		publishedTime: z.date()
	})
});

export const collections = { blog };
