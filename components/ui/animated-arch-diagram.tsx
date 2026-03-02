"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { ArchDiagramData, ArchNode, ArchEdge } from "@/lib/types";

/* ── Node type → icon SVG path + accent color ── */
const nodeIcons: Record<ArchNode["type"], { path: string; color: string }> = {
  client: {
    path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    color: "#10b981",
  },
  gateway: {
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    color: "#10b981",
  },
  service: {
    path: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
    color: "#34d399",
  },
  worker: {
    path: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    color: "#34d399",
  },
  storage: {
    path: "M21 5c0 1.1-4 2-9 2S3 6.1 3 5m18 0c0-1.1-4-2-9-2S3 3.9 3 5m18 0v14c0 1.1-4 2-9 2s-9-.9-9-2V5m18 7c0 1.1-4 2-9 2s-9-.9-9-2",
    color: "#6b6b80",
  },
  monitor: {
    path: "M22 12h-4l-3 9L9 3l-3 9H2",
    color: "#6b6b80",
  },
};

/* ── Compute SVG path between two nodes (smooth curve) ── */
function getEdgePath(
  from: ArchNode,
  to: ArchNode,
  containerW: number,
  containerH: number
): string {
  const x1 = (from.x / 100) * containerW;
  const y1 = (from.y / 100) * containerH;
  const x2 = (to.x / 100) * containerW;
  const y2 = (to.y / 100) * containerH;

  const dx = x2 - x1;
  const dy = y2 - y1;

  // Use cubic bezier for smooth curves
  // Control points offset perpendicular to the line
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  // Determine curve direction based on relative positions
  if (Math.abs(dy) > Math.abs(dx)) {
    // Mostly vertical — curve horizontally
    const cpOffset = dx * 0.1;
    return `M ${x1} ${y1} C ${x1 + cpOffset} ${midY}, ${x2 - cpOffset} ${midY}, ${x2} ${y2}`;
  } else {
    // Mostly horizontal — curve vertically
    const cpOffset = dy * 0.1;
    return `M ${x1} ${y1} C ${midX} ${y1 + cpOffset}, ${midX} ${y2 - cpOffset}, ${x2} ${y2}`;
  }
}

/* ── Flowing particle along a path ── */
function FlowParticle({ pathId, delay, duration }: { pathId: string; delay: number; duration: number }) {
  return (
    <circle r="2.5" fill="#10b981" opacity="0">
      <animateMotion
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;0.9;0.9;0"
        keyTimes="0;0.1;0.8;1"
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
      />
    </circle>
  );
}

/* ── Single connection line with draw-in animation ── */
function EdgeLine({
  edge,
  nodes,
  index,
  containerW,
  containerH,
  visible,
}: {
  edge: ArchEdge;
  nodes: ArchNode[];
  index: number;
  containerW: number;
  containerH: number;
  visible: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [containerW, containerH]);

  if (!fromNode || !toNode || containerW === 0) return null;

  const d = getEdgePath(fromNode, toNode, containerW, containerH);
  const pathId = `edge-${edge.from}-${edge.to}`;
  const drawDelay = 0.3 + index * 0.06;

  return (
    <g>
      {/* Glow layer */}
      <path
        d={d}
        fill="none"
        stroke="#10b981"
        strokeWidth="4"
        strokeLinecap="round"
        opacity={visible ? 0.15 : 0}
        filter="url(#glow)"
        style={{
          transition: `opacity 0.5s ease ${drawDelay}s`,
        }}
      />

      {/* Main line */}
      <path
        ref={pathRef}
        id={pathId}
        d={d}
        fill="none"
        stroke="url(#edgeGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={pathLength || 1000}
        strokeDashoffset={visible ? 0 : pathLength || 1000}
        style={{
          transition: `stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${drawDelay}s`,
        }}
      />

      {/* Flowing particles */}
      {edge.animated !== false && visible && (
        <>
          <FlowParticle pathId={pathId} delay={drawDelay + 0.5} duration={2.5 + index * 0.3} />
          <FlowParticle pathId={pathId} delay={drawDelay + 1.8} duration={2.5 + index * 0.3} />
        </>
      )}
    </g>
  );
}

/* ── Group bounding box ── */
function GroupBox({
  label,
  nodeIds,
  nodes,
  visible,
  index,
}: {
  label: string;
  nodeIds: string[];
  nodes: ArchNode[];
  visible: boolean;
  index: number;
}) {
  const groupNodes = nodes.filter((n) => nodeIds.includes(n.id));
  if (groupNodes.length === 0) return null;

  const padding = 5; // percentage padding
  const minX = Math.min(...groupNodes.map((n) => n.x)) - padding;
  const maxX = Math.max(...groupNodes.map((n) => n.x)) + padding;
  const minY = Math.min(...groupNodes.map((n) => n.y)) - padding;
  const maxY = Math.max(...groupNodes.map((n) => n.y)) + padding;

  return (
    <motion.div
      className="absolute rounded-xl border border-accent/10 bg-accent/[0.02]"
      style={{
        left: `${minX}%`,
        top: `${minY}%`,
        width: `${maxX - minX}%`,
        height: `${maxY - minY}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    >
      <span className="absolute -top-2.5 left-3 bg-[var(--bg2)] px-2 font-mono text-[10px] tracking-wider text-accent/40 uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ── Single node card ── */
function NodeCard({
  node,
  index,
  visible,
}: {
  node: ArchNode;
  index: number;
  visible: boolean;
}) {
  const icon = nodeIcons[node.type];
  const delay = 0.15 + index * 0.08;

  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-2 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_0_16px_rgba(16,185,129,0.15)]"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        visible
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.8 }
      }
      transition={{
        duration: 0.4,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={icon.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d={icon.path} />
      </svg>

      {/* Label */}
      <div className="min-w-0">
        <div className="whitespace-nowrap text-xs font-medium text-[var(--text-primary)]">
          {node.label}
        </div>
        {node.sublabel && (
          <div className="whitespace-nowrap text-[10px] text-[var(--text-muted)]">
            {node.sublabel}
          </div>
        )}
      </div>

      {/* Subtle glow dot */}
      <div
        className="absolute -right-1 -top-1 h-2 w-2 rounded-full"
        style={{
          background: icon.color,
          boxShadow: `0 0 6px ${icon.color}`,
          opacity: 0.6,
        }}
      />
    </motion.div>
  );
}

/* ── Main diagram component ── */
export function AnimatedArchDiagram({ data }: { data: ArchDiagramData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Trigger entrance animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: "16 / 9", minHeight: 300 }}
    >
      {/* Groups layer */}
      {data.groups?.map((group, i) => (
        <GroupBox
          key={group.label}
          label={group.label}
          nodeIds={group.nodeIds}
          nodes={data.nodes}
          visible={visible}
          index={i}
        />
      ))}

      {/* SVG connections layer */}
      {size.w > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Edge gradient */}
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {data.edges.map((edge, i) => (
            <EdgeLine
              key={`${edge.from}-${edge.to}`}
              edge={edge}
              nodes={data.nodes}
              index={i}
              containerW={size.w}
              containerH={size.h}
              visible={visible}
            />
          ))}
        </svg>
      )}

      {/* Nodes layer */}
      {data.nodes.map((node, i) => (
        <NodeCard key={node.id} node={node} index={i} visible={visible} />
      ))}
    </div>
  );
}
