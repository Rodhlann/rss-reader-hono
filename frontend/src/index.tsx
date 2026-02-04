import { Hono } from "hono";
import { env } from "hono/adapter";
import { renderer } from "./renderer";

type Bindings = {
	BACKEND: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

type Entry = {
	title: string;
	url: string;
};

type Feed = {
	name: string;
	url: string;
	entries: Entry[];
};

const Feed = (feed: Feed) => {
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

type Feeds = {
	feeds: Feed[];
};

const Feeds = ({ feeds }: Feeds) => {
	return (
		<>
			{feeds.map((f) => (
				<Feed {...f} />
			))}
		</>
	);
};

app.get("/", async (c) => {
	let data: Feed[];

	const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
	if (NODE_ENV === "development") {
		const entries: Entry[] = new Array(5).fill(null).map(() => ({
			title: "Test Entry",
			url: "Test URL",
		}));
		data = new Array(5).fill(null).map((_, i) => ({
			name: `Test Feed ${i + 1}`,
			url: `Test URL ${i + 1}`,
			entries,
		}));
	} else {
		const res = await c.env.BACKEND.fetch("http://backend.internal/feeds");
		data = await res.json();
	}

	return c.render(<Feeds feeds={data} />);
});

app.get("/admin", (c) => {
	return c.render("Login");
});

export default app;
