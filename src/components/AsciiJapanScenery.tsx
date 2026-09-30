"use client";

import { useEffect, useRef } from "react";
import styles from "./AsciiJapanScenery.module.css";
import referenceAsset from "./japan-night-reference.jpg";

const FONT = '"IBM Plex Mono", "Geist Mono", "SFMono-Regular", Consolas, monospace';
const referenceUrl = typeof referenceAsset === "string" ? referenceAsset : referenceAsset.src;

const CHARS = [".", "·", ":", "+", "*", "#", "%", "@"];

type Glyph = { c: number; r: number; ch: string; a: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function glyphFor(luminance: number) {
  const index = clamp(Math.floor((luminance / 255) * CHARS.length), 0, CHARS.length - 1);
  return CHARS[index];
}

function paint(glyphs: Glyph[], width: number, height: number, cols: number, rows: number, dpr: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const scaleX = width / cols;
  const scaleY = height / rows;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.font = `${Math.max(scaleX, scaleY)}px ${FONT}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  glyphs.forEach((glyph) => {
    context.fillStyle = `rgba(255,255,255,${glyph.a})`;
    context.fillText(glyph.ch, (glyph.c + 0.5) * scaleX, (glyph.r + 0.5) * scaleY);
  });
  return canvas;
}

export default function AsciiJapanScenery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    let width = 0;
    let height = 0;
    let cols = 0;
    let frameX = 0;
    let frameY = 0;
    let frameWidth = 0;
    let frameHeight = 0;
    let upper: HTMLCanvasElement | null = null;
    let lower: HTMLCanvasElement | null = null;
    let shore = 0;
    let frame = 0;
    let visible = false;
    let enteredAt = 0;
    let alive = true;
    const petals = Array.from({ length: 14 }, (_, index) => ({
      x: (index * 0.137) % 1,
      y: (index * 0.233) % 1,
      phase: index * 0.7,
      fall: 0.006 + (index % 5) * 0.002,
    }));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const image = new Image();
    image.src = referenceUrl;

    const resize = () => {
      if (!image.complete || !image.naturalWidth) return;
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width < 2 || height < 2) return;
      const narrow = width < 640;
      const crop = narrow ? 0.1 : 0;
      const aspect = (image.naturalWidth / image.naturalHeight) * (1 - crop * 2);
      frameWidth = width;
      frameHeight = width / aspect;
      if (frameHeight > height) {
        frameHeight = height;
        frameWidth = height * aspect;
      }
      frameX = (width - frameWidth) / 2;
      frameY = (height - frameHeight) / 2;
      const cell = narrow ? Math.max(2.6, frameWidth / 150) : Math.min(frameWidth / 340, frameHeight / 130);
      cols = Math.max(80, Math.floor(frameWidth / cell));
      const rows = Math.max(40, Math.floor(frameHeight / cell));
      shore = Math.round(rows * 0.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sampler = sample.getContext("2d", { willReadFrequently: true });
      if (!sampler) return;
      sampler.drawImage(
        image,
        image.naturalWidth * crop,
        0,
        image.naturalWidth * (1 - crop * 2),
        image.naturalHeight,
        0,
        0,
        cols,
        rows,
      );
      const pixels = sampler.getImageData(0, 0, cols, rows).data;
      const above: Glyph[] = [];
      const below: Glyph[] = [];
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const index = (r * cols + c) * 4;
          const luminance = pixels[index] * 0.3 + pixels[index + 1] * 0.59 + pixels[index + 2] * 0.11;
          if (luminance < 10) continue;
          const glyph = {
            c,
            r,
            ch: glyphFor(luminance),
            a: clamp(0.08 + (luminance / 255) * 0.84, 0.08, 0.92),
          };
          if (r < shore) above.push(glyph);
          else below.push(glyph);
        }
      }
      upper = paint(above, frameWidth, frameHeight, cols, rows, dpr);
      lower = paint(below, frameWidth, frameHeight, cols, rows, dpr);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    };
    const onLeave = () => {
      pointer.x = 0.5;
      pointer.y = 0.5;
    };

    const draw = (time: number) => {
      if (!alive || !width || !upper || !lower) return;
      if (!enteredAt) enteredAt = time;
      const elapsed = reduceMotion ? 4000 : time - enteredAt;
      const shown = reduceMotion ? 1 : clamp(elapsed / 1800, 0, 1);
      if (!reduceMotion) {
        current.x = lerp(current.x, pointer.x, 0.06);
        current.y = lerp(current.y, pointer.y, 0.06);
      }
      const drift = reduceMotion ? 0 : (current.x - 0.5) * 10;
      const lift = reduceMotion ? 0 : (current.y - 0.5) * 4;
      const flow = reduceMotion ? 0 : ((time / 1000) * 18) % width;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#0b0c0c";
      context.fillRect(0, 0, width, height);

      context.save();
      context.beginPath();
      context.rect(0, 0, width, height * Math.min(1, shown * 1.15));
      context.clip();
      context.globalAlpha = shown;
      context.drawImage(upper, frameX + drift * 0.6, frameY + lift * 0.4, frameWidth, frameHeight);
      context.restore();

      if (shown > 0.45) {
        const waterAlpha = reduceMotion ? 1 : clamp((shown - 0.45) / 0.55, 0, 1);
        context.save();
        context.globalAlpha = waterAlpha;
        context.drawImage(lower, frameX + drift * 0.25 - flow, frameY, frameWidth, frameHeight);
        context.drawImage(lower, frameX + drift * 0.25 - flow + frameWidth, frameY, frameWidth, frameHeight);
        context.restore();
      }

      if (!reduceMotion && shown > 0.85) {
        context.font = `${Math.max(width / cols, 3)}px ${FONT}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "rgba(255,255,255,0.55)";
        const chars = ["*", "+", ".", "'"];
        petals.forEach((petal) => {
          petal.y += petal.fall;
          petal.x += Math.sin(time * 0.001 + petal.phase) * 0.0007;
          if (petal.y > 1.02) {
            petal.y = -0.02;
            petal.x = (petal.phase * 0.41) % 1;
          }
          context.fillText(chars[Math.floor((time / 800 + petal.phase) % chars.length)], petal.x * width + drift, petal.y * height);
        });
      }

      if (visible && !reduceMotion) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (!upper) return;
      if (reduceMotion) {
        draw(performance.now());
        return;
      }
      frame = requestAnimationFrame(draw);
    };

    const rebuild = () => {
      resize();
      if (visible) start();
    };

    image.onload = rebuild;
    if (image.complete) rebuild();

    const observer = new ResizeObserver(rebuild);
    observer.observe(stage);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (!visible) {
          cancelAnimationFrame(frame);
          return;
        }
        start();
      },
      { threshold: 0.15 },
    );
    intersection.observe(stage);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <p className={styles.caption}>
        Monochrome animated ASCII Japanese night landscape featuring Mount Fuji, a cherry blossom tree, a traditional
        pavilion, lake, torii gate and pagoda.
      </p>
    </div>
  );
}
