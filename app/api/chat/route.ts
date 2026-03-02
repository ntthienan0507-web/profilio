import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt } from "@/lib/chat-system-prompt";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramNotification(
  firstMessage: string,
  ip: string
): Promise<void> {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const message = [
    "<b>New Chat Session</b>",
    "",
    `<b>First message:</b> ${escapeHtml(firstMessage.slice(0, 500))}`,
    `<b>IP:</b> ${escapeHtml(ip)}`,
    "",
    `<i>${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</i>`,
  ].join("\n");

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    }
  );
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Chat is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const messages: { role: "user" | "assistant"; content: string }[] =
      body.messages || [];
    const isNewSession: boolean = body.isNewSession || false;

    if (!messages.length || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid message history" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== "user" || !lastMsg.content.trim()) {
      return new Response(
        JSON.stringify({ error: "Last message must be from user" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content.slice(0, 2000),
    }));

    if (isNewSession) {
      sendTelegramNotification(lastMsg.content, ip).catch(console.error);
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const systemPrompt = buildSystemPrompt();

    // Convert messages to Gemini format
    const geminiHistory = sanitizedMessages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1].content;

    const stream = ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: [
        ...geminiHistory,
        { role: "user", parts: [{ text: lastUserMessage }] },
      ],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of await stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
