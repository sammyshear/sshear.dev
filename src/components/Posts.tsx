import type { CollectionEntry } from "astro:content";

type Props = {
	posts: CollectionEntry<"blog">[];
};

export default function Posts({ posts }: Props) {
	return (
		<div className="flex flex-col space-y-10 mt-5">
			{posts.map((post: CollectionEntry<"blog">) => {
				return (
					<a
						className="flex flex-col bg-ctp-surface1 p-4 rounded-md"
						key={post.id}
						href={`/posts/${post.slug}`}
					>
						<span className="text-2xl">{post.data.title}</span>
						<span className="text-sm text-ctp-subtext0">
							{post.data.author}
						</span>
						<span className="text-sm text-ctp-subtext0">
							{post.data.publishedTime.toLocaleString()}
						</span>
					</a>
				);
			})}
		</div>
	);
}
