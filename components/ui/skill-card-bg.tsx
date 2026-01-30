"use client";

import { useEffect, useRef } from "react";

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

/* ── Languages: floating code brackets & symbols ── */
const drawLanguages: DrawFn = (ctx, w, h, t) => {
  const symbols = ["{ }", "< />", "( )", "=>", "fn", "::", "&&", "[]"];
  ctx.font = "11px monospace";
  ctx.textAlign = "center";

  for (let i = 0; i < symbols.length; i++) {
    const angle = (i / symbols.length) * Math.PI * 2 + t * 0.3;
    const rx = w * 0.3 + Math.sin(t * 0.5 + i) * 15;
    const ry = h * 0.25 + Math.cos(t * 0.4 + i) * 10;
    const px = w / 2 + Math.cos(angle) * rx;
    const py = h / 2 + Math.sin(angle) * ry;
    const alpha = 0.15 + Math.sin(t * 1.5 + i * 0.8) * 0.1;

    ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
    ctx.fillText(symbols[i], px, py);
  }

  /* Central cursor blink */
  const blink = Math.sin(t * 3) > 0;
  if (blink) {
    ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
    ctx.fillRect(w / 2 - 1, h / 2 - 8, 2, 16);
  }
};

/* ── Frameworks: interconnected grid/module blocks ── */
const drawFrameworks: DrawFn = (ctx, w, h, t) => {
  const blocks = [
    { x: 0.25, y: 0.3 }, { x: 0.5, y: 0.2 }, { x: 0.75, y: 0.3 },
    { x: 0.2, y: 0.55 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.55 },
    { x: 0.35, y: 0.75 }, { x: 0.65, y: 0.75 },
  ];

  const size = 16;

  /* Draw connections first */
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
  ctx.lineWidth = 0.5;
  const connections = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,6],[4,7],[5,7]];
  for (const [a, b] of connections) {
    ctx.beginPath();
    ctx.moveTo(blocks[a].x * w, blocks[a].y * h);
    ctx.lineTo(blocks[b].x * w, blocks[b].y * h);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  /* Draw blocks */
  for (let i = 0; i < blocks.length; i++) {
    const bx = blocks[i].x * w;
    const by = blocks[i].y * h;
    const pulse = Math.sin(t * 2 + i * 0.7) * 0.08;
    const s = size + Math.sin(t * 1.2 + i) * 2;

    ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 + pulse})`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(bx - s / 2, by - s / 2, s, s);

    /* Inner dot */
    ctx.beginPath();
    ctx.arc(bx, by, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + pulse})`;
    ctx.fill();
  }

  /* Data packet along connections */
  const connIdx = Math.floor(t * 0.8) % connections.length;
  const progress = (t * 0.8) % 1;
  const [ca, cb] = connections[connIdx];
  const px = blocks[ca].x * w + (blocks[cb].x * w - blocks[ca].x * w) * progress;
  const py = blocks[ca].y * h + (blocks[cb].y * h - blocks[ca].y * h) * progress;
  ctx.beginPath();
  ctx.arc(px, py, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(16, 185, 129, 0.6)`;
  ctx.fill();
};

/* ── Storage & Data: animated database cylinders with data flow ── */
const drawDatabase: DrawFn = (ctx, w, h, t) => {
  const cx = w / 2;
  const cylinders = [
    { x: cx - 40, y: h * 0.45, rx: 35, ry: 10, height: 30 },
    { x: cx + 30, y: h * 0.35, rx: 30, ry: 8, height: 25 },
    { x: cx - 10, y: h * 0.6, rx: 25, ry: 7, height: 22 },
  ];

  for (let ci = 0; ci < cylinders.length; ci++) {
    const c = cylinders[ci];
    const bounce = Math.sin(t * 1.5 + ci * 1.2) * 3;
    ctx.save();
    ctx.translate(0, bounce);

    ctx.beginPath();
    ctx.moveTo(c.x - c.rx, c.y);
    ctx.lineTo(c.x - c.rx, c.y + c.height);
    ctx.ellipse(c.x, c.y + c.height, c.rx, c.ry, 0, Math.PI, 0, true);
    ctx.lineTo(c.x + c.rx, c.y);
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 + ci * 0.05})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.35 + ci * 0.05})`;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(c.x, c.y + c.height * 0.5, c.rx, c.ry * 0.8, 0, 0, Math.PI);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < 8; i++) {
    const progress = ((t * 0.4 + i * 0.125) % 1);
    const from = cylinders[i % cylinders.length];
    const to = cylinders[(i + 1) % cylinders.length];
    const px = from.x + (to.x - from.x) * progress;
    const py = from.y + (to.y - from.y) * progress + Math.sin(progress * Math.PI) * -20;
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${0.6 * (1 - Math.abs(progress - 0.5) * 2)})`;
    ctx.fill();
  }

  ctx.setLineDash([3, 4]);
  for (let i = 0; i < cylinders.length; i++) {
    const curr = cylinders[i];
    const next = cylinders[(i + 1) % cylinders.length];
    ctx.beginPath();
    ctx.moveTo(curr.x, curr.y + curr.height);
    ctx.lineTo(next.x, next.y);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.setLineDash([]);
};

/* ── Infrastructure: server rack with blinking LEDs + network ── */
const drawInfra: DrawFn = (ctx, w, h, t) => {
  const cx = w / 2;
  const units = [
    { x: cx - 50, y: h * 0.25, w: 60, h: 18 },
    { x: cx - 50, y: h * 0.25 + 22, w: 60, h: 18 },
    { x: cx - 50, y: h * 0.25 + 44, w: 60, h: 18 },
    { x: cx + 10, y: h * 0.35, w: 55, h: 18 },
    { x: cx + 10, y: h * 0.35 + 22, w: 55, h: 18 },
  ];

  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const pulse = Math.sin(t * 2 + i * 0.8) * 0.08;
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 + pulse})`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(u.x, u.y, u.w, u.h);

    for (let line = 0; line < 3; line++) {
      const lx = u.x + u.w * 0.4 + line * 6;
      ctx.beginPath();
      ctx.moveTo(lx, u.y + 4);
      ctx.lineTo(lx, u.y + u.h - 4);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    for (let led = 0; led < 2; led++) {
      const on = Math.sin(t * (3 + i + led) + led * 2) > 0;
      ctx.beginPath();
      ctx.arc(u.x + 8 + led * 8, u.y + u.h / 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = on ? `rgba(16, 185, 129, ${0.7 + pulse})` : "rgba(16, 185, 129, 0.1)";
      ctx.fill();
    }
  }

  ctx.setLineDash([2, 3]);
  const lc = { x: cx - 20, y: h * 0.25 + 33 };
  const rc = { x: cx + 37, y: h * 0.35 + 22 };
  ctx.beginPath();
  ctx.moveTo(lc.x, lc.y);
  ctx.quadraticCurveTo(cx, h * 0.2, rc.x, rc.y);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.setLineDash([]);

  const pkt = ((t * 0.3) % 1);
  const pktX = lc.x + (rc.x - lc.x) * pkt;
  const pktY = lc.y + (rc.y - lc.y) * pkt + Math.sin(pkt * Math.PI) * -15;
  ctx.beginPath();
  ctx.arc(pktX, pktY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
  ctx.fill();

  const cloudY = h * 0.15;
  ctx.beginPath();
  ctx.arc(cx, cloudY, 12, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
  ctx.stroke();

  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
  ctx.beginPath(); ctx.moveTo(cx, cloudY + 12); ctx.lineTo(lc.x, units[0].y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cloudY + 12); ctx.lineTo(rc.x, units[3].y); ctx.stroke();
  ctx.setLineDash([]);
};

/* ── Management: kanban board with moving cards ── */
const drawManagement: DrawFn = (ctx, w, h, t) => {
  const cols = 3;
  const colW = w * 0.22;
  const gap = (w - cols * colW) / (cols + 1);
  const labels = ["TODO", "IN PROG", "DONE"];

  for (let c = 0; c < cols; c++) {
    const cx = gap + c * (colW + gap);
    const cy = h * 0.2;
    const colH = h * 0.65;

    /* Column border */
    ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(cx, cy, colW, colH);

    /* Column header */
    ctx.font = "bold 8px monospace";
    ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
    ctx.textAlign = "center";
    ctx.fillText(labels[c], cx + colW / 2, cy + 12);

    /* Cards in each column */
    const cardCount = c === 1 ? 2 : 3;
    for (let i = 0; i < cardCount; i++) {
      const cardY = cy + 20 + i * 28;
      const cardH = 22;
      const wobble = Math.sin(t * 1.5 + c * 2 + i * 1.3) * 1.5;

      ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 + Math.sin(t + c + i) * 0.05})`;
      ctx.lineWidth = 0.6;
      ctx.strokeRect(cx + 4, cardY + wobble, colW - 8, cardH);

      /* Card lines (text placeholder) */
      ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
      ctx.fillRect(cx + 8, cardY + wobble + 6, colW * 0.5, 2);
      ctx.fillRect(cx + 8, cardY + wobble + 12, colW * 0.3, 2);
    }
  }

  /* Moving card between columns */
  const moveProgress = (t * 0.25) % 1;
  const fromX = gap + colW / 2;
  const toX = gap + 1 * (colW + gap) + colW / 2;
  const cardX = fromX + (toX - fromX) * moveProgress;
  const cardY = h * 0.42 + Math.sin(moveProgress * Math.PI) * -25;

  ctx.strokeStyle = `rgba(16, 185, 129, ${0.4})`;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(cardX - 15, cardY, 30, 16);
  ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
  ctx.fillRect(cardX - 11, cardY + 5, 14, 2);
};

/* ── Observability: live monitoring dashboard with pulse lines ── */
const drawObservability: DrawFn = (ctx, w, h, t) => {
  /* Waveform / heartbeat line */
  const lines = [
    { y: h * 0.3, speed: 2, amp: 15, freq: 3 },
    { y: h * 0.5, speed: 1.5, amp: 10, freq: 5 },
    { y: h * 0.7, speed: 1.8, amp: 12, freq: 4 },
  ];

  for (const line of lines) {
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const nx = x / w;
      const spike = nx > 0.4 && nx < 0.6
        ? Math.sin((nx - 0.4) * Math.PI / 0.2) * line.amp * 2
        : 0;
      const y = line.y + Math.sin(x * 0.05 * line.freq + t * line.speed) * line.amp * 0.3 + spike * Math.sin(t * 3);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  /* Scanning line */
  const scanX = ((t * 0.2) % 1) * w;
  ctx.beginPath();
  ctx.moveTo(scanX, h * 0.15);
  ctx.lineTo(scanX, h * 0.85);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();

  /* Alert dots */
  for (let i = 0; i < 4; i++) {
    const dx = w * (0.2 + i * 0.2);
    const dy = h * 0.2 + Math.sin(t * 2 + i) * 5;
    const alpha = Math.sin(t * 3 + i * 1.5) > 0.5 ? 0.5 : 0.15;
    ctx.beginPath();
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
    ctx.fill();
  }

  /* Grid lines */
  ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
  ctx.lineWidth = 0.5;
  for (let gy = h * 0.2; gy < h * 0.85; gy += 20) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }
};

/* ── Methodologies: Clean Architecture layered pyramid + flowing principles ── */
const drawMethodologies: DrawFn = (ctx, w, h, t) => {
  const cx = w / 2;
  const labels = ["DOMAIN", "USE CASES", "ADAPTERS", "INFRA"];
  const layerCount = labels.length;

  /* Stacked trapezoid layers — widest at bottom */
  for (let i = 0; i < layerCount; i++) {
    const y = h * 0.2 + i * (h * 0.16);
    const topW = w * (0.2 + i * 0.15);
    const botW = w * (0.25 + i * 0.15);
    const lh = h * 0.12;
    const pulse = Math.sin(t * 1.5 + i * 0.8) * 0.06;

    /* Trapezoid */
    ctx.beginPath();
    ctx.moveTo(cx - topW / 2, y);
    ctx.lineTo(cx + topW / 2, y);
    ctx.lineTo(cx + botW / 2, y + lh);
    ctx.lineTo(cx - botW / 2, y + lh);
    ctx.closePath();
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 + pulse + i * 0.03})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    /* Label */
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(16, 185, 129, ${0.2 + pulse})`;
    ctx.fillText(labels[i], cx, y + lh / 2 + 3);
  }

  /* Dependency arrows flowing upward along sides */
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 3; i++) {
      const progress = ((t * 0.3 + i * 0.33) % 1);
      const py = h * 0.2 + (h * 0.64) * (1 - progress);
      const layerIdx = Math.min(3, Math.floor((1 - progress) * 4));
      const layerW = w * (0.22 + layerIdx * 0.15);
      const px = cx + side * (layerW / 2 + 8);

      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${0.5 * (1 - Math.abs(progress - 0.5) * 2)})`;
      ctx.fill();
    }
  }

  /* Pulsing center line */
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.18);
  ctx.lineTo(cx, h * 0.85);
  ctx.strokeStyle = `rgba(16, 185, 129, ${0.06 + Math.sin(t * 2) * 0.03})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  /* SOLID dots at the top */
  const solidLetters = ["S", "O", "L", "I", "D"];
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  for (let i = 0; i < 5; i++) {
    const sx = cx - 28 + i * 14;
    const sy = h * 0.13;
    const glow = Math.sin(t * 2 + i * 1.2) > 0.3;
    ctx.fillStyle = `rgba(16, 185, 129, ${glow ? 0.4 : 0.15})`;
    ctx.fillText(solidLetters[i], sx, sy);
  }
};

/* ── Category → draw function map ── */
const categoryDrawMap: Record<string, DrawFn> = {
  Languages: drawLanguages,
  Frameworks: drawFrameworks,
  "Storage & Data": drawDatabase,
  Infrastructure: drawInfra,
  Management: drawManagement,
  Observability: drawObservability,
  Methodologies: drawMethodologies,
};

export function SkillCardBg({ category }: { category: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawFn = categoryDrawMap[category];

  useEffect(() => {
    if (!drawFn) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    function animate() {
      const t = performance.now() / 1000;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawFn(ctx!, canvas!.width, canvas!.height, t);
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, [drawFn]);

  if (!drawFn) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full rounded-[calc(1rem-1px)]"
      aria-hidden="true"
    />
  );
}
