import type { Feed, RawFeed } from "../types";

export class Sqlite {
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	fetchFeeds = async (): Promise<Feed[]> => {
		const { results } = await this.db
			.prepare(
				"SELECT json_object('name', name, 'url', url, 'entries', (SELECT json_group_array(json_object('title', title, 'url', url)) FROM Entries AS e WHERE e.feedId = f.id)) AS record FROM Feeds AS f;",
			)
			.run();
		return results.map((res) => JSON.parse(res.record as string) as Feed);
	};

	addFeed = async (feed: RawFeed): Promise<void> => {
		await this.db
			.prepare("INSERT INTO Feeds (name, url) VALUES (?, ?);")
			.bind(feed.name, feed.url)
			.run();
	};
}
