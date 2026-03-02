"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  darkMode: true,
  themeVariables: {
    primaryColor: "#1a1a2e",
    primaryBorderColor: "#10b981",
    primaryTextColor: "#f0f0f5",
    secondaryColor: "#12121a",
    secondaryBorderColor: "#10b981",
    secondaryTextColor: "#a0a0b8",
    tertiaryColor: "#0a0a0f",
    lineColor: "#10b981",
    textColor: "#a0a0b8",
    mainBkg: "#1a1a2e",
    nodeBorder: "#10b981",
    clusterBkg: "rgba(255,255,255,0.03)",
    clusterBorder: "rgba(16,185,129,0.3)",
    titleColor: "#f0f0f5",
    edgeLabelBackground: "#0a0a0f",
    nodeTextColor: "#f0f0f5",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 12,
    nodeSpacing: 30,
    rankSpacing: 40,
  },
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 13,
});

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

export function MermaidDiagram({ chart, id = "mermaid" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const uniqueId = `${id}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, id]);

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        Diagram render error
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container flex items-center justify-center overflow-auto [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
