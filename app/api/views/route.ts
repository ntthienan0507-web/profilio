import { NextResponse } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command: string[]) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  return res.json();
}

export async function POST() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ views: 0 }, { status: 500 });
  }

  try {
    const data = await redis(["INCR", "page_views"]);
    return NextResponse.json({ views: data.result });
  } catch {
    return NextResponse.json({ views: 0 }, { status: 500 });
  }
}

export async function GET() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ views: 0 }, { status: 500 });
  }

  try {
    const data = await redis(["GET", "page_views"]);
    return NextResponse.json({ views: Number(data.result) || 0 });
  } catch {
    return NextResponse.json({ views: 0 }, { status: 500 });
  }
}
