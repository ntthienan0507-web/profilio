import { list, put } from "@vercel/blob";
import { defaultContent } from "./data";
import type { PortfolioContent } from "./types";

const BLOB_FILENAME = "portfolio-content.json";

export async function getContent(): Promise<PortfolioContent> {
  try {
    const { blobs } = await list({ prefix: BLOB_FILENAME, limit: 1 });
    if (blobs.length === 0) return defaultContent;

    const res = await fetch(blobs[0].url, { next: { revalidate: 60 } });
    if (!res.ok) return defaultContent;

    const data = (await res.json()) as Partial<PortfolioContent>;
    return { ...defaultContent, ...data };
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: PortfolioContent): Promise<void> {
  await put(BLOB_FILENAME, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
