// Content dates are stored as plain strings (YYYY-MM or YYYY-MM-DD). These helpers
// format them by hand instead of through Date, so the output never shifts with the
// build machine's time zone.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RANGE_SEPARATOR = ' – ';

function monthName(month: string): string {
  return MONTHS[Number(month) - 1];
}

/** '2025-03' becomes 'Mar 2025'. */
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  return `${monthName(month)} ${year}`;
}

/** '2025-03' to 'present' becomes 'Mar 2025 – Present' (using the given present label). */
export function formatMonthRange(start: string, end: string, presentLabel: string): string {
  const endText = end === 'present' ? presentLabel : formatMonth(end);
  return `${formatMonth(start)}${RANGE_SEPARATOR}${endText}`;
}

/** '2026-11-09' becomes '9 Nov 2026'. */
export function formatDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${Number(day)} ${monthName(month)} ${year}`;
}
