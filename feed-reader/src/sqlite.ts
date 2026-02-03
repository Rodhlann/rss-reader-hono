import type { Entry, RawFeed } from "../types";

export class Sqlite {
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	fetchFeeds = async (): Promise<RawFeed[]> => {
		const { results } = await this.db
			.prepare(
				// "SELECT json_object('name', name, 'url', url, 'entries', (SELECT json_group_array(json_object('title', title, 'url', url)) FROM Entries AS e WHERE e.feedId = f.id)) AS record FROM Feeds AS f;"
				"SELECT json_object('id', id, 'name', name, 'url', url) AS record FROM Feeds;",
			)
			.run();
		console.log(`Fetching ${results.length} feeds`);
		return results.map((res) => JSON.parse(res.record as string) as RawFeed);
	};

	insertEntries = async (entries: Entry[]): Promise<void> => {
		console.log(`Inserting ${entries.length} entries`);
		if (!entries.length) return;
		const formatted = entries.flatMap((e) => [e.feedId, e.title, e.url]);
		const prepared = new Array(entries.length)
			.fill(0)
			.map(() => "(?, ?, ?)")
			.join(", ");
		const sql = `INSERT INTO Entries (feedId, title, url) VALUES ${prepared};`;
		await this.db
			.prepare(sql)
			.bind(...formatted)
			.run();
	};

	clearEntries = async (): Promise<void> => {
		console.log("Clearing entries");
		await this.db.prepare("DELETE FROM Entries;").run();
	};
}
