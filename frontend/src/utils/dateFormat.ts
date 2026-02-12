import { format } from "date-fns";

export function formatDate(isoString: string): string {
    return format(new Date(isoString), "MMM dd, yyyy HH:mm");
}

export function parseDate(formatted: string): string | null {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/;
    const match = formatted.match(regex);
    if (!match) return null;
    const [, month, day, year, hours, minutes] = match;
    const m = +month, d = +day, h = +hours, min = +minutes;
    if (m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || min > 59) return null;
    const date = new Date(+year, m - 1, d, h, min);
    if (date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date.toISOString();
}

export function isValidDateFormat(value: string): boolean {
    return parseDate(value) !== null;
}

export function isoToFormattedDate(isoString: string): string {
    const d = new Date(isoString);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${month}/${day}/${year} ${hours}:${minutes}`;
}
