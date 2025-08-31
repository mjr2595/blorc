import writers from "../data/writers.json";

interface Article {
  id: string;
  title: string;
  link: string;
  published: string;
  isoTime: number;
  summary?: string;
  writerName: string;
  writerSite: string;
}

export async function getArticles(): Promise<Article[]> {
  const { XMLParser } = await import("fast-xml-parser");
  const parser = new XMLParser({ ignoreAttributes: false });
  const items: Article[] = [];

  await Promise.all(
    writers.map(async (w) => {
      try {
        console.log(`Fetching RSS feed for ${w.name} from ${w.rss}`);
        const res = await fetch(w.rss, {
          headers: {
            "user-agent": "Mozilla/5.0 (compatible; RSSAggregator/1.0)",
            accept:
              "application/rss+xml, application/xml, application/atom+xml, text/xml, */*",
          },
        });

        if (!res.ok) {
          console.error(
            `Failed to fetch RSS feed for ${w.name}: ${res.status} ${res.statusText}`
          );
          return;
        }

        const xml = await res.text();
        console.log(
          `Received XML content for ${w.name}: ${xml.slice(0, 200)}...`
        );
        const feed = parser.parse(xml);
        console.log(
          `Parsed feed structure:`,
          JSON.stringify(feed, null, 2).slice(0, 200)
        );
        const entries = (
          feed?.rss?.channel?.item ||
          feed?.feed?.entry ||
          []
        ).slice(0, 20);

        for (const e of entries) {
          const link =
            typeof e.link === "string" ? e.link : e.link?.["@_href"] || e.id;
          const published =
            e.pubDate || e.published || e.updated || new Date().toISOString();
          const date = new Date(published);

          items.push({
            id: e.guid || link,
            title: e.title?.toString() || "Untitled",
            link,
            published: date.toISOString(),
            isoTime: date.getTime(),
            summary: e["content:encoded"] || e.description || e.summary,
            writerName: w.name,
            writerSite: w.site,
          });
        }
      } catch (error) {
        console.error(`Error fetching feed for ${w.name}:`, error);
      }
    })
  );

  return items.sort((a, b) => b.isoTime - a.isoTime).slice(0, 25);
}
