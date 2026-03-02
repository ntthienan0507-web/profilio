"use client";

import { Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(
  () => import("@/components/ui/mermaid-diagram").then((m) => m.MermaidDiagram),
  { ssr: false }
);

interface ArchitectureModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  chart: string;
}

export function ArchitectureModal({ open, onClose, title, chart }: ArchitectureModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[85vh] overflow-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--bg2)] shadow-2xl"
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
                  // architecture
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--glass-border)] text-[var(--text-muted)] transition-colors hover:border-accent hover:text-accent"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Diagram area */}
            <div className="p-6 sm:p-8">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                }
              >
                <MermaidDiagram chart={chart} id={`arch-${title.replace(/\s+/g, "-").toLowerCase()}`} />
              </Suspense>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
