import { defineLiveCollection } from "astro:content";
import { commentsLoader } from "./loaders/comments";

const comments = defineLiveCollection({
	type: "live",
	loader: commentsLoader()
});

export const collections = { comments };
