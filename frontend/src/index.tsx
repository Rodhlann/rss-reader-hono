import { Hono } from "hono";
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
	const res = await c.env.BACKEND.fetch("http://backend.internal/feeds");
	console.log(res);
	const data: Feed[] = await res.json();
	console.log(data);
	return c.render(<Feeds feeds={data} />);
});

app.get("/admin", (c) => {
	return c.render("Login");
});

export default app;
