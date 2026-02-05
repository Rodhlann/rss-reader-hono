import { Hono } from "hono";
import { Sqlite } from "./sqlite";

type Bindings = {
	FEEDS_DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/feeds", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	return c.json(await db.fetchFeeds());
});

app.get("/entries", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	return c.json(await db.fetchEntries());
});

app.post("/feed", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	const body = await c.req.json();
	await db.addFeed(body);
	return c.json(await db.fetchFeeds());
});

app.post("/entry/:feedId", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	const body = await c.req.json();
	const feedId = Number.parseInt(c.req.param("feedId"), 10);
	await db.addEntry(feedId, body);
	return c.json(await db.fetchFeeds());
});

app.delete("/feed/:id", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	const id = Number.parseInt(c.req.param("id"), 10);
	await db.deleteFeed(id);
	return c.json(await db.fetchFeeds());
});

export default app;
