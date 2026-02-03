export type RawFeed = {
	name: string;
	url: string;
};

export type Entry = {
	title: string;
	url: string;
};

export type Feed = RawFeed & {
	entries: Entry[];
};
