import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import type { PortfolioContent } from "@/lib/types";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = (await req.json()) as PortfolioContent;
    await saveContent(content);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }
}
