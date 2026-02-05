import type { Feed } from "../types";

const FeedContent = (feed: Feed) => {
	const children = feed.entries.map((e) => (
		<li>
			<a href={e.url}>{e.title}</a>
		</li>
	));
	const root = feed.url.substring(0, feed.url.lastIndexOf("/"));
	return (
		<>
			<h1>
				<a href={root}>{feed.name}</a>
			</h1>
			<ul>{children}</ul>
		</>
	);
};

type FeedsInput = {
	feeds: Feed[];
};

export const Feeds = ({ feeds }: FeedsInput) => {
	return (
		<>
			{feeds.map((f) => (
				<FeedContent {...f} />
			))}
		</>
	);
};
