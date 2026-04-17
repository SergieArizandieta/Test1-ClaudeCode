import {
  getDaysInMonth,
  getDay,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
  format,
} from 'date-fns';
import type { Chore } from '../types';

// Returns a map of "YYYY-MM-DD" -> Chore[] for the given month
export function getChoresForMonth(
  chores: Chore[],
  year: number,
  month: number // 0-indexed
): Map<string, Chore[]> {
  const result = new Map<string, Chore[]>();

  const addToDay = (dateStr: string, chore: Chore) => {
    const list = result.get(dateStr) ?? [];
    list.push(chore);
    result.set(dateStr, list);
  };

  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (const chore of chores) {
    const start = parseISO(chore.startDate);
    const end = chore.endDate ? parseISO(chore.endDate) : null;

    const inRange = (d: Date) => {
      if (isBefore(d, start) && !isEqual(d, start)) return false;
      if (end && isAfter(d, end)) return false;
      return true;
    };

    const { type, dayOfWeek, dayOfMonth } = chore.recurrence;

    if (type === 'none') {
      const d = parseISO(chore.startDate);
      if (d.getFullYear() === year && d.getMonth() === month) {
        addToDay(chore.startDate, chore);
      }
    } else if (type === 'daily') {
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        if (inRange(d)) {
          addToDay(format(d, 'yyyy-MM-dd'), chore);
        }
      }
    } else if (type === 'weekly' && dayOfWeek !== undefined) {
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        if (getDay(d) === dayOfWeek && inRange(d)) {
          addToDay(format(d, 'yyyy-MM-dd'), chore);
        }
      }
    } else if (type === 'monthly' && dayOfMonth !== undefined) {
      const d = new Date(year, month, dayOfMonth);
      if (d.getMonth() === month && inRange(d)) {
        addToDay(format(d, 'yyyy-MM-dd'), chore);
      }
    }
  }

  return result;
}
