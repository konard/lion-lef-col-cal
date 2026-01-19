import type { MonthNumber } from "./col-cal.type";

export const createDateFromMonthNumber = (
  month: MonthNumber,
  year: number = new Date().getFullYear(),
  day: number = 3,
): Date => {
  return new Date(year, month, day);
};

export const getMonths = (locale: string = "en-US") =>
  Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2000, i, 1).toLocaleString(locale, {
      month: "short",
    });
    return locale.startsWith("ru")
      ? (month.charAt(0).toUpperCase() + month.slice(1)).replace(/\.$/, "")
      : month;
  });

export const getWeeks = (locale: string = "en-US") => {
  const baseDate = new Date(2000, 0, 3);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    return date
      .toLocaleString(locale, { weekday: "narrow" })
      .replace(/\./g, "")
      .charAt(0);
  });
};

// Temporal-like date utility functions (replacing date-fns)

/**
 * Returns the first day of the month for the given date.
 * Similar to Temporal.PlainDate.prototype.with({ day: 1 })
 */
export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Returns the last day of the month for the given date.
 * Similar to getting the last day via Temporal.PlainYearMonth
 */
export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Returns an array of all dates within the given interval (inclusive).
 * Similar to iterating through Temporal.PlainDate range
 */
export const eachDayOfInterval = (interval: { start: Date; end: Date }): Date[] => {
  const days: Date[] = [];
  const current = new Date(interval.start);
  current.setHours(0, 0, 0, 0);
  const end = new Date(interval.end);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

/**
 * Checks if two dates are the same day.
 * Similar to Temporal.PlainDate.prototype.equals()
 */
export const isSameDay = (dateLeft: Date, dateRight: Date): boolean => {
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth() &&
    dateLeft.getDate() === dateRight.getDate()
  );
};

/**
 * Checks if two dates are in the same month.
 * Similar to comparing Temporal.PlainYearMonth
 */
export const isSameMonth = (dateLeft: Date, dateRight: Date): boolean => {
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth()
  );
};

/**
 * Checks if the first date is before the second date.
 * Similar to Temporal.PlainDate.prototype.compare() < 0
 */
export const isBefore = (date: Date, dateToCompare: Date): boolean => {
  return date.getTime() < dateToCompare.getTime();
};

/**
 * Checks if the first date is after the second date.
 * Similar to Temporal.PlainDate.prototype.compare() > 0
 */
export const isAfter = (date: Date, dateToCompare: Date): boolean => {
  return date.getTime() > dateToCompare.getTime();
};

/**
 * Adds the specified number of days to the given date.
 * Similar to Temporal.PlainDate.prototype.add({ days: n })
 */
export const addDays = (date: Date, amount: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

/**
 * Subtracts the specified number of days from the given date.
 * Similar to Temporal.PlainDate.prototype.subtract({ days: n })
 */
export const subDays = (date: Date, amount: number): Date => {
  return addDays(date, -amount);
};

/**
 * Adds the specified number of months to the given date.
 * Similar to Temporal.PlainDate.prototype.add({ months: n })
 */
export const addMonths = (date: Date, amount: number): Date => {
  const result = new Date(date);
  const day = result.getDate();
  result.setMonth(result.getMonth() + amount);
  // Handle month overflow (e.g., Jan 31 + 1 month should be Feb 28/29)
  if (result.getDate() !== day) {
    result.setDate(0); // Set to last day of previous month
  }
  return result;
};

/**
 * Subtracts the specified number of months from the given date.
 * Similar to Temporal.PlainDate.prototype.subtract({ months: n })
 */
export const subMonths = (date: Date, amount: number): Date => {
  return addMonths(date, -amount);
};

/**
 * Gets the day of the week (0-6, Sunday = 0).
 * Similar to Temporal.PlainDate.prototype.dayOfWeek (but 0-indexed)
 */
export const getDay = (date: Date): number => {
  return date.getDay();
};

/**
 * Formats a date using locale-aware formatting.
 * Replaces date-fns format() with Intl.DateTimeFormat
 */
export const formatDate = (date: Date, formatStr: string, locale: string = "en-US"): string => {
  // Handle common format patterns
  switch (formatStr) {
    case "MMMM yyyy":
      return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
    case "PPP":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    default:
      return date.toLocaleDateString(locale);
  }
};
