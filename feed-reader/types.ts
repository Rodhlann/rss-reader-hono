export type RawFeed = {
  id: number,
  name: string,
  url: string
}

export type Entry = {
  feedId: number,
  title: string,
  url: string
}

export type Feed = RawFeed & {
  entries: Entry[]
}
