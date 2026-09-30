"use client";

import { useEffect, useRef } from "react";

type Leaf = {
  x: number;
  y: number;
  speed: number;
  sway: number;
  phase: number;
  spin: number;
  size: number;
  alpha: number;
};

function createLeaf(width: number, height: number, scattered: boolean): Leaf {
  return {
    x: Math.random() * width,
    y: scattered ? Math.random() * height : -8 - Math.random() * height * 0.35,
    speed: height * (0.035 + Math.random() * 0.05),
    sway: 10 + Math.random() * 22,
    phase: Math.random() * Math.PI * 2,
    spin: 0.6 + Math.random() * 1.4,
    size: Math.max(2.4, width * 0.004) + Math.random() * 3.2,
    alpha: 0.42 + Math.random() * 0.5,
  };
}

function drawLeaf(context: CanvasRenderingContext2D, leaf: Leaf, time: number) {
  const drift = Math.sin(time * 0.0011 + leaf.phase) * leaf.sway;
  const rotation = Math.sin(time * 0.001 * leaf.spin + leaf.phase) * 1.1;
  context.save();
  context.translate(leaf.x + drift, leaf.y);
  context.rotate(rotation);
  context.globalAlpha = leaf.alpha;
  context.fillStyle = "#fff";
  context.beginPath();
  context.ellipse(0, 0, leaf.size * 0.38, leaf.size, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export default function AsciiJapanScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const source = new Image();
    source.src = "/japan-night.jpg";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaves: Leaf[] = [];
    let alive = true;
    let visible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let last = 0;

    const paintScene = () => {
      if (!source.naturalWidth || !source.naturalHeight) return;
      const imageRatio = source.naturalWidth / source.naturalHeight;
      const frameRatio = width / height;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = source.naturalWidth;
      let sourceHeight = source.naturalHeight;

      if (frameRatio > imageRatio) {
        sourceHeight = source.naturalWidth / frameRatio;
        sourceY = (source.naturalHeight - sourceHeight) / 2;
      } else {
        sourceWidth = source.naturalHeight * frameRatio;
        sourceX = (source.naturalWidth - sourceWidth) / 2;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      if (nextWidth === width && nextHeight === height) return;

      const previousWidth = width || nextWidth;
      const previousHeight = height || nextHeight;
      width = nextWidth;
      height = nextHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (leaves.length === 0) {
        const count = Math.round(18 + width / 80);
        for (let index = 0; index < count; index += 1) leaves.push(createLeaf(width, height, true));
      } else {
        leaves.forEach((leaf) => {
          leaf.x = (leaf.x / previousWidth) * width;
          leaf.y = (leaf.y / previousHeight) * height;
          leaf.speed = height * (0.035 + (leaf.phase % 1) * 0.05);
        });
      }
    };

    const tick = (time: number) => {
      if (!alive || !width || !height || !source.naturalWidth) return;
      const delta = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      paintScene();

      if (!reduceMotion) {
        leaves.forEach((leaf) => {
          leaf.y += leaf.speed * delta;
          if (leaf.y > height + leaf.size * 2) {
            const next = createLeaf(width, height, false);
            leaf.x = next.x;
            leaf.y = next.y;
            leaf.speed = next.speed;
            leaf.sway = next.sway;
            leaf.phase = next.phase;
            leaf.spin = next.spin;
            leaf.size = next.size;
            leaf.alpha = next.alpha;
          }
          drawLeaf(context, leaf, time);
        });
      }

      if (visible && !reduceMotion) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!source.naturalWidth) return;
      if (reduceMotion) {
        paintScene();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (source.naturalWidth) start();
    });
    observer.observe(wrapper);

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
    intersection.observe(wrapper);

    source.onload = () => {
      resize();
      start();
    };
    if (source.complete && source.naturalWidth > 0) {
      resize();
      start();
    }

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit",
        background: "#000",
      }}
      aria-label="Monochrome Japanese night landscape with Mount Fuji, cherry blossoms, a pavilion, a torii gate, a pagoda, the moon, and a lake."
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          display: "block",
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
