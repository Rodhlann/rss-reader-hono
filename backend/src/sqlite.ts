import type { Entry, Feed, RawFeed } from "../types";

export class Sqlite {
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	fetchFeeds = async (): Promise<Feed[]> => {
		const { results } = await this.db
			.prepare(
				"SELECT json_object('id', id, 'name', name, 'url', url, 'entries', (SELECT json_group_array(json_object('title', title, 'url', url)) FROM Entries AS e WHERE e.feedId = f.id)) AS record FROM Feeds AS f;",
			)
			.run();
		return results.map((res) => JSON.parse(res.record as string) as Feed);
	};

	fetchEntries = async (): Promise<Entry[]> => {
		const { results } = await this.db
			.prepare(
				"SELECT json_object('title', title, 'url', url) as record FROM Entries",
			)
			.run();
		return results.map((res) => JSON.parse(res.record as string) as Entry);
	};

	addFeed = async (feed: RawFeed): Promise<void> => {
		await this.db
			.prepare("INSERT INTO Feeds (name, url) VALUES (?, ?);")
			.bind(feed.name, feed.url)
			.run();
	};

	addEntry = async (feedId: number, entry: Entry): Promise<void> => {
		await this.db
			.prepare("INSERT INTO Entries (feedId, title, url) VALUES (?, ?, ?);")
			.bind(feedId, entry.title, entry.url)
			.run();
	};

	deleteFeed = async (id: number): Promise<void> => {
		await this.db.prepare("DELETE FROM Feeds WHERE id = ?;").bind(id).run();
	};
}
