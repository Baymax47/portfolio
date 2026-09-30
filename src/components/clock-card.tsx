"use client";

import { useEffect, useRef } from "react";

const DIGITS: Record<string, string[]> = {
  "0": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["01110", "10000", "11110", "10001", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
};

const ROWS = 7;

function glyphWidth(char: string) {
  return DIGITS[char]?.[0].length ?? 0;
}

function clockText(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function gridWidth(text: string) {
  return text.split("").reduce((total, char, index) => {
    return total + glyphWidth(char) + (index > 0 ? 1 : 0);
  }, 0);
}

export function ClockCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let alive = true;

    const draw = () => {
      if (!alive) return;
      const now = new Date();
      const text = clockText(now);
      card.setAttribute("aria-label", `Local time ${text}`);

      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const columns = gridWidth(text);
      const cell = Math.min(width / columns, height / ROWS);
      const originX = (width - columns * cell) / 2;
      const originY = (height - ROWS * cell) / 2;
      const radius = cell * 0.32;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      let column = 0;
      text.split("").forEach((char, index) => {
        if (index > 0) column += 1;
        const glyph = DIGITS[char];
        if (!glyph) return;
        glyph.forEach((row, rowIndex) => {
          row.split("").forEach((bit, bitIndex) => {
            const x = originX + (column + bitIndex + 0.5) * cell;
            const y = originY + (rowIndex + 0.5) * cell;
            const lit = bit === "1";
            context.beginPath();
            context.arc(x, y, lit ? radius : radius * 0.82, 0, Math.PI * 2);
            if (lit) {
              context.shadowColor = "rgba(255,255,255,0.9)";
              context.shadowBlur = radius * 1.8;
              context.fillStyle = "#fff";
            } else {
              context.shadowBlur = 0;
              context.fillStyle = "rgba(255,255,255,0.14)";
            }
            context.fill();
            context.shadowBlur = 0;
          });
        });
        column += glyphWidth(char);
      });
    };

    draw();
    const timer = window.setInterval(draw, 1000);
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);

    return () => {
      alive = false;
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={cardRef} className="bento-card theme-card" aria-label="Local time">
      <canvas ref={canvasRef} className="clock-face" aria-hidden="true" />
    </section>
  );
}
