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

app.post("/feed", async (c) => {
	const db = new Sqlite(c.env.FEEDS_DB);
	const body = await c.req.json();
	await db.addFeed(body);
	return c.json(await db.fetchFeeds());
});

export default app;
