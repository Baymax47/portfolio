"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./UltronAscii.module.css";

const CHARS = [" ", ".", "·", ":", "+", "*", "#", "%", "@"];

type Point = {
  x: number;
  y: number;
  power: number;
  red?: boolean;
};

export default function UltronAscii({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);

  const mouse = useRef({ x: 0.5, y: 0.5 });
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;

    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let start = 0;
    let running = false;
    let announced = false;
    let alive = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      mouse.current.x = (event.clientX - rect.left) / rect.width;
      mouse.current.y = (event.clientY - rect.top) / rect.height;
    };

    wrap.addEventListener("pointermove", onPointerMove);

    const distanceToLine = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const length = C * C + D * D;

      let param = -1;

      if (length !== 0) param = dot / length;

      let xx;
      let yy;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      const dx = px - xx;
      const dy = py - yy;

      return Math.sqrt(dx * dx + dy * dy);
    };

    const linePower = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      thickness = 0.018,
    ) => {
      const distance = distanceToLine(px, py, x1, y1, x2, y2);

      return Math.max(0, 1 - distance / thickness);
    };

    const ellipsePower = (
      px: number,
      py: number,
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      thickness = 0.04,
    ) => {
      const normalized = Math.sqrt(
        ((px - cx) * (px - cx)) / (rx * rx) + ((py - cy) * (py - cy)) / (ry * ry),
      );

      return Math.max(0, 1 - Math.abs(normalized - 1) / thickness);
    };

    const sampleRobot = (x: number, y: number, time: number, weight: number): Point => {
      let power = 0;
      let red = false;
      const t = (value: number) => value * weight;

      power = Math.max(power, ellipsePower(x, y, 0.5, 0.39, 0.175, 0.31, t(0.075)));

      power = Math.max(power, linePower(x, y, 0.5, 0.09, 0.5, 0.54, t(0.014)));

      power = Math.max(power, linePower(x, y, 0.45, 0.1, 0.43, 0.48, t(0.012)));

      power = Math.max(power, linePower(x, y, 0.55, 0.1, 0.57, 0.48, t(0.012)));

      power = Math.max(power, linePower(x, y, 0.35, 0.24, 0.41, 0.56, t(0.02)));

      power = Math.max(power, linePower(x, y, 0.65, 0.24, 0.59, 0.56, t(0.02)));

      power = Math.max(power, linePower(x, y, 0.37, 0.46, 0.45, 0.68, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.63, 0.46, 0.55, 0.68, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.45, 0.68, 0.5, 0.73, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.55, 0.68, 0.5, 0.73, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.4, 0.58, 0.37, 0.78, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.6, 0.58, 0.63, 0.78, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.37, 0.7, 0.13, 0.95, t(0.026)));

      power = Math.max(power, linePower(x, y, 0.63, 0.7, 0.87, 0.95, t(0.026)));

      power = Math.max(power, linePower(x, y, 0.11, 0.95, 0.4, 0.82, t(0.02)));

      power = Math.max(power, linePower(x, y, 0.89, 0.95, 0.6, 0.82, t(0.02)));

      power = Math.max(power, linePower(x, y, 0.36, 0.8, 0.47, 0.98, t(0.018)));

      power = Math.max(power, linePower(x, y, 0.64, 0.8, 0.53, 0.98, t(0.018)));

      const leftEye =
        linePower(x, y, 0.37, 0.39, 0.465, 0.43, t(0.03)) *
        linePower(x, y, 0.37, 0.39, 0.465, 0.43, t(0.07));

      const rightEye =
        linePower(x, y, 0.63, 0.39, 0.535, 0.43, t(0.03)) *
        linePower(x, y, 0.63, 0.39, 0.535, 0.43, t(0.07));

      if (leftEye > 0.15 || rightEye > 0.15) {
        red = true;

        const pulse = reduceMotion ? 1 : 0.82 + Math.sin(time * 0.005) * 0.18;

        power = Math.max(power, Math.max(leftEye, rightEye) * 1.8 * pulse);
      }

      const techNoise =
        Math.sin(x * 91 + y * 43 + time * 0.0003) * Math.cos(y * 81 - time * 0.00021);

      if (power > 0.06 && !reduceMotion) {
        power += techNoise * 0.12;
      }

      return {
        x,
        y,
        power: Math.max(0, Math.min(1, power)),
        red,
      };
    };

    const draw = (time: number) => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      if (!start) start = time;
      const elapsed = time - start;
      const boot = reduceMotion ? 1 : Math.min(1, elapsed / 1900);

      if (boot >= 1 && !announced && alive) {
        announced = true;
        setBooted(true);
      }

      const portrait = height > width * 1.05;
      const fit = Math.min(width, height) * (portrait ? 0.62 : 0.78);
      const originX = (width - fit) / 2;
      const originY = portrait ? Math.max(36, height * 0.1) : (height - fit) / 2;
      const pointerX = reduceMotion ? 0 : (mouse.current.x - 0.5) * fit * 0.045;
      const pointerY = reduceMotion ? 0 : (mouse.current.y - 0.5) * fit * 0.03;

      const cell = fit < 320 ? 5 : width < 650 ? 8 : 10;
      const weight = Math.min(1.85, Math.max(1, (cell * 1.15) / fit / 0.016));

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${cell}px "IBM Plex Mono", "SFMono-Regular", Consolas, monospace`;

      for (let py = cell; py < height; py += cell * 1.15) {
        for (let px = cell; px < width; px += cell * 0.82) {
          const x = (px - originX - pointerX) / fit;
          const y = (py - originY - pointerY) / fit;

          if (x < -0.02 || x > 1.02 || y < -0.02 || y > 1.02) continue;

          const point = sampleRobot(x, y, time, weight);

          if (point.power < 0.08) continue;

          const reveal = boot * 1.25;

          if (y > reveal) continue;

          let intensity = point.power;

          if (!reduceMotion) {
            const scan = (time * 0.00016) % 1;

            if (Math.abs(y - scan) < 0.015) {
              intensity += 0.22;
            }
          }

          const index = Math.min(CHARS.length - 1, Math.floor(intensity * CHARS.length));

          const flicker = reduceMotion
            ? 0
            : Math.sin(time * 0.004 + px * 0.09 + py * 0.07) * 0.08;

          if (point.red) {
            ctx.fillStyle = `rgba(255, 50, 45, ${Math.min(1, 0.6 + intensity + flicker)})`;
            ctx.shadowColor = "rgba(255, 35, 30, .55)";
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = `rgba(225, 229, 232, ${Math.max(0.08, intensity * 0.78 + flicker)})`;
            ctx.shadowBlur = 0;
          }

          let glitchX = 0;

          if (
            !reduceMotion &&
            Math.sin(time * 0.002 + py * 0.3) > 0.985 &&
            Math.random() > 0.65
          ) {
            glitchX = (Math.random() - 0.5) * 25;
          }

          ctx.fillText(CHARS[index], px + glitchX, py);
        }
      }

      ctx.shadowBlur = 0;

      if (boot > 0.45) {
        const beamAlpha = reduceMotion ? 0.12 : 0.08 + Math.max(0, Math.sin(time * 0.0017)) * 0.11;
        const eyeY = originY + pointerY + fit * 0.405;

        const gradient = ctx.createLinearGradient(
          originX + fit * 0.12,
          eyeY,
          originX + fit * 0.88,
          eyeY,
        );

        gradient.addColorStop(0, "rgba(255,40,35,0)");
        gradient.addColorStop(0.4, `rgba(255,40,35,${beamAlpha})`);
        gradient.addColorStop(0.6, `rgba(255,40,35,${beamAlpha})`);
        gradient.addColorStop(1, "rgba(255,40,35,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(originX + fit * 0.12, eyeY);
        ctx.lineTo(originX + fit * 0.88, eyeY);
        ctx.stroke();
      }

      if (!reduceMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const startDrawing = () => {
      if (running) return;
      running = true;

      if (reduceMotion) {
        resize();
        draw(performance.now());
        return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        startDrawing();
      },
      { threshold: 0.25 },
    );

    intersection.observe(wrap);

    return () => {
      alive = false;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      intersection.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className={`${styles.wrapper} ${className}`.trim()}
      aria-label="Animated ASCII robot interface"
    >
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.noise} />
      <div className={styles.vignette} />
      <div className={styles.scanlines} />

      <div className={styles.hud}>
        <div className={styles.hudTop}>
          <span className={styles.statusDot} />
          <span>ULTRON://INITIALISING</span>
        </div>

        <div className={styles.hudRows}>
          <p className={booted ? styles.visible : ""}>&gt; ANALYSING HUMAN PATTERNS</p>

          <p className={`${styles.delay1} ${booted ? styles.visible : ""}`}>&gt; OPTIMISING SYSTEMS</p>

          <p className={`${styles.delay2} ${booted ? styles.visible : ""}`}>&gt; LEARNING DESIGN</p>

          <p className={`${styles.delay3} ${booted ? styles.visible : ""}`}>&gt; ADAPTING...</p>

          <p className={`${styles.ready} ${styles.delay4} ${booted ? styles.visible : ""}`}>&gt; READY.</p>
        </div>
      </div>

      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />

      <div className={styles.microTextLeft}>SYS.01&nbsp;&nbsp;&nbsp; ONLINE</div>

      <div className={styles.microTextBottom}>ASCII CORE // ACTIVE</div>
    </section>
  );
}
