"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "chatbot_messages";
const SESSION_FLAG = "chatbot_session_started";

const QUICK_QUESTIONS = [
  "What's Chung's tech stack?",
  "Tell me about his experience",
  "How to contact Chung?",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load messages from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  // Save messages to sessionStorage on change
  useEffect(() => {
    if (messages.length === 0) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || isStreaming) return;

    setError(null);
    setInput("");
    setIsStreaming(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: msgText,
    };

    const assistantId = crypto.randomUUID();

    setMessages((prev) => {
      const updated = [...prev, userMsg];

      // Fire API call with the updated messages
      const apiMessages = updated.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let isNewSession = false;
      try {
        isNewSession = !sessionStorage.getItem(SESSION_FLAG);
        if (isNewSession) sessionStorage.setItem(SESSION_FLAG, "1");
      } catch {}

      // Start streaming in background
      (async () => {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: apiMessages, isNewSession }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to get response");
          }

          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          if (!reader) throw new Error("No response stream");

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m
              )
            );
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantId)
          );
        } finally {
          setIsStreaming(false);
        }
      })();

      return [...updated, { id: assistantId, role: "assistant" as const, content: "" }];
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat bubble button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-[200] flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition-colors",
          open
            ? "border-accent/40 bg-[var(--bg2)] text-accent hover:bg-[var(--bg3)]"
            : "border-accent/60 bg-accent text-white hover:shadow-[var(--glow-accent)]"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-[200] flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--bg2)] shadow-2xl"
            style={{ height: "min(500px, calc(100vh - 8rem))" }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Corner brackets */}
            <span className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l-2 border-t-2 border-accent opacity-60" />
            <span className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r-2 border-t-2 border-accent opacity-60" />
            <span className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b-2 border-l-2 border-accent opacity-60" />
            <span className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b-2 border-r-2 border-accent opacity-60" />

            {/* Top accent line */}
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-accent/40 via-accent/10 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-3">
              <div>
                <span className="mb-0.5 block font-mono text-[10px] tracking-wider text-accent uppercase">
                  // ai assistant
                </span>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Ask me about Chung
                </h3>
              </div>
              <div className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="mb-3 text-sm text-[var(--text-secondary)]">
                    Hi! I can answer questions about Chung&apos;s skills,
                    experience, and projects.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-accent hover:text-accent"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "ml-auto rounded-br-sm bg-accent text-white"
                      : "mr-auto rounded-bl-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--text-primary)]"
                  )}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.3s]" />
                    </span>
                  )}
                </div>
              ))}

              {error && (
                <p className="text-center text-xs text-red-400">{error}</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-[var(--glass-border)] px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  rows={1}
                  maxLength={2000}
                  className="flex-1 resize-none rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3.5 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-accent"
                  style={{ maxHeight: "80px" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all hover:bg-accent-hover disabled:opacity-40"
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
