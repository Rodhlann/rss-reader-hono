import { Sqlite } from './sqlite'
import { Entry, RawFeed } from '../types';
import { parseFeeds as parseFeed } from './rss';
import { Hono } from 'hono';

type Bindings = {
  FEEDS_DB: D1Database;
}

const app = new Hono();

export default {
  async fetch(request: Request, env: Bindings) {
    return await app.fetch(request, env)
  },
  async scheduled(
    controller: ScheduledController,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    const db = new Sqlite(env.FEEDS_DB);
    await db.clearEntries();
    const rawFeeds = await db.fetchFeeds();
    const promises = await Promise.allSettled(rawFeeds.map(async (f: RawFeed) => await parseFeed(f)));
    let entries: Entry[] = [];
    promises.forEach((p) => {
      switch (p.status) {
        case 'fulfilled':
          entries = entries.concat(p.value.entries);
          break;
        default:
          console.error('Failed to fetch feed entries: ', p.reason)
      }
    });
    await db.insertEntries(entries);
  }
}
