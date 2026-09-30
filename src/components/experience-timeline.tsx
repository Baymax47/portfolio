"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { ExperienceRecord } from "@/content/portfolio";
import {
  careerDatesIncomplete,
  formatDateRange,
  formatExperience,
} from "@/lib/experience";

type Point = { x: number; y: number };

export function ExperienceTimeline({ entries }: { entries: ExperienceRecord[] }) {
  const [active, setActive] = useState(0);
  const [scrollValue, setScrollValue] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrubberId = useId();
  const safeIndex = Math.min(active, Math.max(entries.length - 1, 0));
  const current = entries[safeIndex];
  const total = formatExperience(entries);
  const incomplete = careerDatesIncomplete(entries);
  const count = Math.max(entries.length, 1);
  const width = Math.max(720, count * 240);
  const points = buildPoints(entries.length, width);
  const path = pathFrom(points, width);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function onScroll() {
      const el = scrollerRef.current;
      if (!el || el.clientWidth === 0) return;
      const max = el.scrollWidth - el.clientWidth;
      setScrollValue(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * 1000));

      const nodeButtons = [...el.querySelectorAll<HTMLElement>("[data-index]")];
      if (nodeButtons.length === 0) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      nodeButtons.forEach((node, index) => {
        const mid = node.offsetLeft + node.offsetWidth / 2;
        const distance = Math.abs(mid - center);
        if (distance < nearestDistance) {
          nearest = index;
          nearestDistance = distance;
        }
      });
      setActive((currentIndex) => (currentIndex === nearest ? currentIndex : nearest));
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [entries.length]);

  function select(index: number) {
    const next = Math.max(0, Math.min(entries.length - 1, index));
    setActive(next);
    const scroller = scrollerRef.current;
    const node = scroller?.querySelector<HTMLElement>(`[data-index="${next}"]`);
    if (!scroller || !node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const left = node.offsetLeft - scroller.clientWidth / 2 + node.offsetWidth / 2;
    scroller.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select(index - 1);
    }
  }

  function scrub(value: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    scroller.scrollLeft = (value / 1000) * Math.max(max, 0);
    setScrollValue(value);
  }

  const valueText = current
    ? `${current.role} at ${current.organization}. ${formatDateRange(current)}`
    : "Experience timeline";

  return (
    <section className="bento-card slot-experience flex h-full flex-col p-6 min-[1200px]:p-8" aria-labelledby="experience-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="experience-title" className="text-[24px] leading-[1.4] font-medium">
            Experience roller coaster
          </h2>
          <p className="experience-support mt-2 max-w-[48ch] text-[15px] leading-6 text-[var(--muted)]">
            A quiet path through the roles that are on record.
          </p>
        </div>
        <p className="text-sm font-medium tracking-[0.08em] uppercase text-[var(--muted)]">
          {total ?? "Experience timeline"}
        </p>
      </div>

      {incomplete ? (
        <p className="experience-note mt-4 text-sm leading-6 text-[var(--muted)]">
          Add career dates to complete the timeline
        </p>
      ) : null}

      <div className="experience-curve mt-6 hidden md:block">
        <div ref={scrollerRef} className="timeline-scroll relative">
          <div className="timeline-stage relative h-44" style={{ width: entries.length > 1 ? width : "100%" }}>
            <svg
              viewBox={`0 0 ${width} 140`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-hidden="true"
            >
              <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--line-strong)]" />
            </svg>
            {entries.map((entry, index) => {
              const point = points[index];
              if (!point) return null;
              const left = `${(point.x / width) * 100}%`;
              const top = `${(point.y / 140) * 100}%`;
              return (
                <div key={entry.id}>
                  <button
                    type="button"
                    data-index={index}
                    aria-pressed={index === safeIndex}
                    aria-label={`${entry.role} at ${entry.organization}`}
                    onClick={() => select(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    className={`milestone-node ${index === safeIndex ? "is-active" : ""}`}
                    style={{ left, top }}
                  />
                  <span className="milestone-label" style={{ left, top: `calc(${top} + 12px)` }}>
                    {entry.milestone ?? entry.organization}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <label className="mt-3 block text-sm text-[var(--muted)]" htmlFor={scrubberId}>
          Timeline position
          <input
            id={scrubberId}
            className="timeline-range"
            type="range"
            min={0}
            max={1000}
            step={1}
            value={scrollValue}
            aria-label="Experience timeline position"
            aria-valuetext={valueText}
            onChange={(event) => scrub(Number(event.target.value))}
          />
        </label>
      </div>

      <ol className="experience-list mt-6 grid gap-2 md:hidden">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <button
              type="button"
              aria-pressed={index === safeIndex}
              onClick={() => setActive(index)}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                index === safeIndex
                  ? "border-[var(--ink)] bg-[var(--chip)]"
                  : "border-[var(--line)]"
              }`}
            >
              <span className="block text-base font-medium">{entry.role}</span>
              <span className="mt-1 block text-sm text-[var(--muted)]">{entry.organization}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="experience-nav mt-5 flex items-center gap-2">
        <button
          type="button"
          className="icon-button"
          aria-label="Previous role"
          disabled={safeIndex === 0}
          onClick={() => select(safeIndex - 1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Next role"
          disabled={safeIndex >= entries.length - 1}
          onClick={() => select(safeIndex + 1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {current ? (
        <div className="experience-details mt-5" aria-live="polite">
          <p className="text-[22px] leading-[1.4] font-medium">{current.role}</p>
          <p className="mt-1 text-base">{current.organization}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{formatDateRange(current)}</p>
          <p className="experience-description mt-3 max-w-[62ch] text-base leading-7">{current.description}</p>
        </div>
      ) : null}
    </section>
  );
}

function buildPoints(count: number, width: number): Point[] {
  const total = Math.max(count, 1);
  const left = 48;
  const right = width - 48;
  return Array.from({ length: total }, (_, index) => {
    const t = total === 1 ? 0.22 : index / (total - 1);
    const x = left + t * (right - left);
    const y = 72 + Math.sin(t * Math.PI) * -34 + (index % 2 === 0 ? 10 : -8);
    return { x, y };
  });
}

function pathFrom(points: Point[], width: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const point = points[0];
    return `M 20 86 C ${point.x * 0.45} 36, ${point.x} ${point.y}, ${point.x} ${point.y} S ${width * 0.72} 108, ${width - 24} 62`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const midX = start.x + (end.x - start.x) / 2;
    path += ` C ${midX} ${start.y - 28}, ${midX} ${end.y + 28}, ${end.x} ${end.y}`;
  }
  return path;
}
