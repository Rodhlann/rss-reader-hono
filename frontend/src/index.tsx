import { Hono } from "hono";
import { env } from "hono/adapter";
import { Admin } from "./components/admin";
import { Feeds } from "./components/feeds";
import { renderer } from "./renderer";
import type { Entry, Feed } from "./types";

type Bindings = {
	BACKEND: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

const MOCK_ENTRIES: Entry[] = new Array(5).fill(null).map(() => ({
	title: "Test Entry",
	url: "Test URL",
}));
const MOCK_FEEDS: Feed[] = new Array(5).fill(null).map((_, i) => ({
	id: i,
	name: `Test Feed ${i + 1}`,
	url: `Test URL ${i + 1}`,
	entries: MOCK_ENTRIES,
}));

app.get("/", async (c) => {
	let data: Feed[];

	const { NODE_ENV } = env<{ NODE_ENV: string }>(c);
	if (NODE_ENV === "development") {
		data = MOCK_FEEDS;
	} else {
		const res = await c.env.BACKEND.fetch("http://backend.internal/feeds");
		data = await res.json();
	}

	return c.render(<Feeds feeds={data} />);
});

app.get("/admin", (c) => {
	return c.render(<Admin />);
});

export default app;
