"use client";

import { useEffect, useRef } from "react";

/* ── Storage & Data: animated database cylinders with data flow ── */
function drawDatabase(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w / 2;

  /* Three stacked cylinders */
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

    /* Body */
    ctx.beginPath();
    ctx.moveTo(c.x - c.rx, c.y);
    ctx.lineTo(c.x - c.rx, c.y + c.height);
    ctx.ellipse(c.x, c.y + c.height, c.rx, c.ry, 0, Math.PI, 0, true);
    ctx.lineTo(c.x + c.rx, c.y);
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 + ci * 0.05})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    /* Top ellipse */
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.35 + ci * 0.05})`;
    ctx.stroke();

    /* Middle stripe */
    ctx.beginPath();
    ctx.ellipse(c.x, c.y + c.height * 0.5, c.rx, c.ry * 0.8, 0, 0, Math.PI);
    ctx.strokeStyle = `rgba(16, 185, 129, 0.15)`;
    ctx.stroke();

    ctx.restore();
  }

  /* Data flow particles — small dots moving between cylinders */
  for (let i = 0; i < 8; i++) {
    const progress = ((t * 0.4 + i * 0.125) % 1);
    const fromIdx = i % cylinders.length;
    const toIdx = (i + 1) % cylinders.length;
    const from = cylinders[fromIdx];
    const to = cylinders[toIdx];

    const px = from.x + (to.x - from.x) * progress;
    const py = from.y + (to.y - from.y) * progress + Math.sin(progress * Math.PI) * -20;

    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(16, 185, 129, ${0.6 * (1 - Math.abs(progress - 0.5) * 2)})`;
    ctx.fill();
  }

  /* Connection lines between cylinders */
  ctx.setLineDash([3, 4]);
  for (let i = 0; i < cylinders.length; i++) {
    const next = cylinders[(i + 1) % cylinders.length];
    const curr = cylinders[i];
    ctx.beginPath();
    ctx.moveTo(curr.x, curr.y + curr.height);
    ctx.lineTo(next.x, next.y);
    ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

/* ── Infrastructure: server rack with blinking LEDs + network lines ── */
function drawInfra(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const cx = w / 2;

  /* Server rack units */
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

    /* Server box */
    ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 + pulse})`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(u.x, u.y, u.w, u.h);

    /* Ventilation lines */
    for (let line = 0; line < 3; line++) {
      const lx = u.x + u.w * 0.4 + line * 6;
      ctx.beginPath();
      ctx.moveTo(lx, u.y + 4);
      ctx.lineTo(lx, u.y + u.h - 4);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.08)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    /* LED indicators — blink at different rates */
    for (let led = 0; led < 2; led++) {
      const on = Math.sin(t * (3 + i + led) + led * 2) > 0;
      ctx.beginPath();
      ctx.arc(u.x + 8 + led * 8, u.y + u.h / 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = on
        ? `rgba(16, 185, 129, ${0.7 + pulse})`
        : "rgba(16, 185, 129, 0.1)";
      ctx.fill();
    }
  }

  /* Network connection lines between racks */
  ctx.setLineDash([2, 3]);
  const leftCenter = { x: cx - 20, y: h * 0.25 + 33 };
  const rightCenter = { x: cx + 37, y: h * 0.35 + 22 };

  ctx.beginPath();
  ctx.moveTo(leftCenter.x, leftCenter.y);
  ctx.quadraticCurveTo(cx, h * 0.2, rightCenter.x, rightCenter.y);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.setLineDash([]);

  /* Data packet moving along the curve */
  const pkt = ((t * 0.3) % 1);
  const pktX = leftCenter.x + (rightCenter.x - leftCenter.x) * pkt;
  const pktY = leftCenter.y + (rightCenter.y - leftCenter.y) * pkt
    + Math.sin(pkt * Math.PI) * (h * 0.2 - leftCenter.y + (leftCenter.y + rightCenter.y) / 2) * -0.3;

  ctx.beginPath();
  ctx.arc(pktX, pktY, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(16, 185, 129, ${0.5 + Math.sin(t * 4) * 0.3})`;
  ctx.fill();

  /* Cloud node at top */
  const cloudX = cx;
  const cloudY = h * 0.15;
  ctx.beginPath();
  ctx.arc(cloudX, cloudY, 12, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  /* Lines from cloud to racks */
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(cloudX, cloudY + 12);
  ctx.lineTo(leftCenter.x, units[0].y);
  ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cloudX, cloudY + 12);
  ctx.lineTo(rightCenter.x, units[3].y);
  ctx.stroke();
  ctx.setLineDash([]);
}

/* Map category name → draw function */
const categoryDrawMap: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void> = {
  "Storage & Data": drawDatabase,
  Infrastructure: drawInfra,
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
