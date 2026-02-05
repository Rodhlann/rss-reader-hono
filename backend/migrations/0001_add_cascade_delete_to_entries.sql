-- Migration number: 0001 	 2026-02-05T01:25:22.997Z

CREATE TABLE entries_new (
    feedId INTEGER,
    title TEXT,
    url TEXT,
    FOREIGN KEY(feedId) REFERENCES Feeds(id) ON DELETE CASCADE
);

INSERT INTO entries_new (feedId, title, url)
SELECT feedId, title, url FROM Entries;

DROP TABLE Entries;
ALTER TABLE entries_new RENAME TO Entries;
