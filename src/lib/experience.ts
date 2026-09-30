import type { ExperienceRecord } from "@/content/portfolio";

export function formatDateRange(entry: ExperienceRecord): string {
  if (!entry.start) {
    return entry.current
      ? "Current role · start date not added"
      : "Dates not added";
  }

  const start = formatMonth(entry.start);
  if (entry.current || !entry.end) return `${start} – Present`;
  return `${start} – ${formatMonth(entry.end)}`;
}

export function formatExperience(
  records: ExperienceRecord[],
  now = new Date(),
): string | null {
  if (records.length === 0 || records.some((record) => !record.start)) {
    return null;
  }

  const intervals = records.map((record) => {
    const start = parseDate(record.start as string);
    const end = record.current || !record.end ? now : parseDate(record.end);
    if (!start || !end || end < start) return null;
    return { start, end };
  });

  if (intervals.some((interval) => interval === null)) return null;

  const sorted = (intervals as { start: Date; end: Date }[])
    .slice()
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged: { start: Date; end: Date }[] = [];
  for (const interval of sorted) {
    const last = merged[merged.length - 1];
    if (!last || interval.start > last.end) {
      merged.push({ ...interval });
    } else if (interval.end > last.end) {
      last.end = interval.end;
    }
  }

  const months = merged.reduce(
    (total, interval) => total + completedMonths(interval.start, interval.end),
    0,
  );

  return formatMonthCount(months);
}

export function careerDatesIncomplete(records: ExperienceRecord[]): boolean {
  return records.length === 0 || records.some((record) => !record.start);
}

function parseDate(value: string): Date | null {
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatMonth(value: string): string {
  const date = parseDate(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Completed calendar months. A partial current month is not counted as a full extra month. */
function completedMonths(start: Date, end: Date): number {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

function formatMonthCount(months: number): string {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const yearLabel = years === 1 ? "year" : "years";
  const monthLabel = remainder === 1 ? "month" : "months";

  if (years === 0) return `${remainder} ${monthLabel}`;
  if (remainder === 0) return `${years} ${yearLabel}`;
  return `${years} ${yearLabel}, ${remainder} ${monthLabel}`;
}
