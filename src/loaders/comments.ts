import { fetchComments, type Comment } from "@bryanguffey/astro-standard-site";
import type { LiveLoader } from "astro/loaders";
import { getCollection } from "astro:content";

interface CommentEntry extends Comment {
	blogPostId: string;
}

interface EntryFilter {
	cid: string;
}

export function commentsLoader(): LiveLoader<CommentEntry, EntryFilter> {
	return {
		name: "comment-loader",
		loadCollection: async () => {
			try {
				const blogPosts = await getCollection("blog");
				let comments: CommentEntry[] = [];
				await Promise.all(
					blogPosts.map(async (blogPost) => {
						const postComments = await fetchComments({
							bskyPostUri: blogPost.data.bskyPostUri
						});
						let postCommentEntries: CommentEntry[] = [];
						postComments.forEach(
							(comment) =>
								(postCommentEntries = [
									...postCommentEntries,
									{
										...comment,
										blogPostId: blogPost.id
									} as CommentEntry
								])
						);
						comments = [...postCommentEntries, ...comments];
					})
				);

				console.log(comments);

				const ret = {
					entries: comments.map((comment) => ({
						id: comment.cid,
						data: comment
					}))
				};

				console.log(ret);

				return ret;
			} catch (error) {
				return {
					error: new Error("Failed to load articles", {
						cause: error
					})
				};
			}
		},
		loadEntry: async ({ filter }) => {
			try {
				const blogPosts = await getCollection("blog");
				let comments: CommentEntry[] = [];
				await Promise.all(
					blogPosts.map(async (blogPost) => {
						const postComments = await fetchComments({
							bskyPostUri: blogPost.data.bskyPostUri
						});
						let postCommentEntries: CommentEntry[] = [];
						postComments.forEach(
							(comment) =>
								(postCommentEntries = [
									...postCommentEntries,
									{
										...comment,
										blogPostId: blogPost.id
									} as CommentEntry
								])
						);
						comments = [...postCommentEntries, ...comments];
					})
				);

				if (!comments) {
					return {
						error: new Error("Comments not found")
					};
				}

				const comment = comments.filter(
					(comment) => comment.cid == filter.cid
				)[0];

				return {
					id: comment.cid,
					data: comment
				};
			} catch (error) {
				return {
					error: new Error("Failed to load article", { cause: error })
				};
			}
		}
	};
}
