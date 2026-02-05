export type Entry = {
	title: string;
	url: string;
};

export type Feed = {
	id: number;
	name: string;
	url: string;
	entries: Entry[];
};
