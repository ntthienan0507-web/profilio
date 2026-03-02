"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "contact_popup_dismissed";
const POPUP_DELAY_MS = 30_000;

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    const timer = setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleDismiss]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setSubmitState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim() }),
      });

      if (!res.ok) throw new Error();

      setSubmitState("success");
      setTimeout(() => handleDismiss(), 2000);
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--bg2)] shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner brackets */}
            <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-accent opacity-60" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-accent opacity-60" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-accent opacity-60" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-accent opacity-60" />

            {/* Top accent line */}
            <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-accent/40 via-accent/10 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-6 py-4">
              <div>
                <span className="mb-1 block font-mono text-xs tracking-wider text-accent uppercase">
                  // connect
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Let&apos;s Get in Touch
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--glass-border)] text-[var(--text-muted)] transition-colors hover:border-accent hover:text-accent"
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {submitState === "success" ? (
                <motion.div
                  className="flex flex-col items-center gap-3 py-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
                    <motion.svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <motion.path
                        d="M20 6L9 17l-5-5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                    </motion.svg>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Thanks! I&apos;ll reach out soon.
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="mb-5 text-sm text-[var(--text-secondary)]">
                    Drop your info and I&apos;ll reach out! Zalo, Telegram, or
                    phone — whatever works for you.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        maxLength={100}
                        className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                        Zalo / Telegram / Phone
                      </label>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Phone number or @username"
                        required
                        maxLength={200}
                        className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-accent"
                      />
                    </div>
                    {submitState === "error" && (
                      <p className="text-xs text-red-400">
                        Something went wrong. Please try again.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitState === "submitting"}
                      className={cn(
                        "w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover disabled:opacity-50",
                        submitState === "submitting" && "cursor-wait"
                      )}
                    >
                      {submitState === "submitting" ? (
                        <span className="flex items-center justify-center gap-2">
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
                          Sending...
                        </span>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
