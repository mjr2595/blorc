import bloggers from "../data/bloggers.json";
import { XMLParser } from "fast-xml-parser";

const FETCH_TIMEOUT = 6000;
const BATCH_SIZE = 4;
const MAX_ARTICLES_PER_FEED = 10;

export interface Article {
  id: string;
  title: string;
  link: string;
  published: string;
  isoTime: number;
  summary?: string;
  writerName: string;
  writerSite: string;
  channelTitle?: string;
}

export async function getArticles(): Promise<Article[]> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: false,
    trimValues: true,
  });

  const items: Article[] = [];

  const batches = [];
  for (let i = 0; i < bloggers.length; i += BATCH_SIZE) {
    batches.push(bloggers.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (w) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

          const res = await fetch(w.rss, {
            signal: controller.signal,
            headers: {
              "user-agent": "Mozilla/5.0 (compatible; RSSAggregator/1.0)",
              accept:
                "application/rss+xml, application/xml, application/atom+xml",
            },
          });

          clearTimeout(timeout);

          if (!res.ok) {
            console.warn(`RSS fetch failed for ${w.name}: ${res.status}`);
            return;
          }

          const xml = await res.text();
          const feed = parser.parse(xml);

          // Handle single items not being arrays
          let entries = feed?.rss?.channel?.item || feed?.feed?.entry || [];
          if (!Array.isArray(entries)) {
            entries = [entries];
          }
          entries = entries.slice(0, MAX_ARTICLES_PER_FEED);

          const channelTitle =
            feed?.rss?.channel?.title || feed?.feed?.title || w.name;

          for (const e of entries) {
            if (!e) continue; // Skip null/undefined entries

            const link =
              typeof e.link === "string" ? e.link : e.link?.["@_href"] || e.id;

            if (!link) continue; // Skip entries without links

            const published =
              e.pubDate || e.published || e.updated || new Date().toISOString();
            const date = new Date(published);

            // Skip invalid dates
            if (isNaN(date.getTime())) continue;

            items.push({
              id: e.guid || link,
              title: e.title?.toString() || "Untitled",
              link,
              published: date.toISOString(),
              isoTime: date.getTime(),
              summary: e.description || e.summary || e["content:encoded"] || "",
              writerName: w.name,
              writerSite: w.site,
              channelTitle: channelTitle?.toString() || w.name,
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.warn(`Error fetching ${w.name}:`, errorMessage);
        }
      })
    );
  }

  return items.sort((a, b) => b.isoTime - a.isoTime).slice(0, 25);
}
