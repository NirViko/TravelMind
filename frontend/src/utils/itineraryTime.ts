// Utility helpers for the Nocturnal Concierge timeline view.
// All day/time data comes from the AI — these helpers only handle formatting.

export interface TransitLabel {
  label: string;
  icon: "walk" | "car";
}

// Cycled between consecutive activities in the timeline
export const TRANSIT_LABELS: TransitLabel[] = [
  { label: "12 min walk", icon: "walk" },
  { label: "8 min drive", icon: "car" },
  { label: "15 min drive", icon: "car" },
];

/**
 * Returns the calendar Date for a given 1-based day number relative to the trip's startDate.
 */
export function getCalendarDateForDay(startDate: string, day: number): Date {
  const base = new Date(startDate);
  base.setDate(base.getDate() + (day - 1));
  return base;
}

/**
 * Formats a Date as a two-line day pill label, e.g. "MAR\n21".
 */
export function formatDayPill(date: Date): string {
  const month = date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = date.getDate();
  return `${month}\n${day}`;
}

/**
 * Converts "HH:MM" (24h) to a display string like "09:30 AM" / "01:00 PM".
 */
export function formatDisplayTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, "0")}:${m} ${period}`;
}
