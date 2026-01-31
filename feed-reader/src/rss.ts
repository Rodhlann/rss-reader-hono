import Parser from 'rss-parser'
import { Entry, Feed, RawFeed } from '../types'

type RSSFeed = {
  title: string
  link: string
  items: RSSItem[]
}

type RSSItem = {
  title: string
  link: string
}

export const parseFeeds = async (feed: RawFeed, maxEntries = 5): Promise<Feed> => {
  const parser: Parser = new Parser()

  const res = await fetch(feed.url, {
    headers: {
      "X-Source": "Cloudflare-Workers",
      "User-Agent": "RSS Reader - Rodhlann"
    },
  });

  const data = await res.text();
  const rssFeed: RSSFeed = await parser.parseString(data) as RSSFeed;

  const entries = rssFeed.items
    .slice(0, maxEntries)
    .map((r: RSSItem): Entry => ({
      feedId: feed.id,
      title: r.title,
      url: r.link
    })
  );

  return {
    ...feed,
    entries
  };
}
