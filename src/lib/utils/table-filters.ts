import type { FilterFn } from '@tanstack/table-core'

/**
 * Helper to parse row value as Date.
 * Handles Date objects, Brazilian format strings, and numbers (timestamps).
 */
function parseDate(rowValue: any): Date | null {
  if (rowValue instanceof Date) {
    return new Date(rowValue);
  } else if (typeof rowValue === 'string') {
    // Check for DD/MM/YYYY or DD/MM/YYYY HH:MM:SS format
    const brMatch = rowValue.match(/^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}):(\d{2}))?$/);
    if (brMatch) {
      const [_, day, month, year, hour, minute, second] = brMatch;
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hour ? parseInt(hour) : 0,
        minute ? parseInt(minute) : 0,
        second ? parseInt(second) : 0
      );
    } else {
      return new Date(rowValue);
    }
  } else if (typeof rowValue === 'number') {
    return new Date(rowValue);
  }
  return null;
}

/**
 * Filter for date ranges (day level).
 * Expects value to be an array of [startDate, endDate] or null.
 * Normalizes start to 00:00:00 and end to 23:59:59.
 */
export const dateRangeFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId)
  if (!rowValue) return false

  const [start, end] = value as [Date | null, Date | null]

  // If no filter is applied, show all
  if (!start && !end) return true

  const d = parseDate(rowValue);

  if (!d || isNaN(d.getTime())) return false

  if (start) {
    const s = new Date(start)
    s.setHours(0, 0, 0, 0)
    if (d < s) return false
  }

  if (end) {
    const e = new Date(end)
    e.setHours(23, 59, 59, 999)
    if (d > e) return false
  }

  return true
}

/**
 * Filter for date and hour ranges.
 * Expects value to be an array of [startDateTime, endDateTime] or null.
 * Respects exact hours/minutes provided in the filter.
 */
export const dateHourRangeFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId)
  if (!rowValue) return false

  const [start, end] = value as [Date | null, Date | null]

  if (!start && !end) return true

  const d = parseDate(rowValue);

  if (!d || isNaN(d.getTime())) return false

  if (start && d < start) return false
  if (end && d > end) return false

  return true
}


/**
 * Filter for numeric ranges.
 * Expects value to be an array of [min, max] or null.
 */
export const numberRangeFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId) as number
  if (rowValue === undefined || rowValue === null) return false

  const [min, max] = value as [number | null, number | null]

  if (min === null && max === null) return true

  if (min !== null && rowValue < min) return false
  if (max !== null && rowValue > max) return false

  return true
}

/**
 * Filter for multiple selected values (checkbox list).
 * Expects value to be an array of selected options.
 */
export const multiSelectFilter: FilterFn<any> = (row, columnId, value) => {
  const rowValue = row.getValue(columnId)
  const selectedValues = value as any[]

  if (!selectedValues || selectedValues.length === 0) return true

  return selectedValues.includes(rowValue)
}
