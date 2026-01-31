DROP TABLE IF EXISTS Entries;
DROP TABLE IF EXISTS Feeds;

CREATE TABLE IF NOT EXISTS Feeds (id INTEGER PRIMARY KEY, name TEXT, url TEXT);
INSERT INTO Feeds (name, url) VALUES ('Reddit', 'https://www.reddit.com/.rss');

CREATE TABLE IF NOT EXISTS Entries (feedId INTEGER, title TEXT, url TEXT, FOREIGN KEY(feedId) REFERENCES Feeds(id));
