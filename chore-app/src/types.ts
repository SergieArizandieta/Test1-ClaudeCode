export interface TeamMember {
  id: string;
  name: string;
  color: string;
}

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Recurrence {
  type: RecurrenceType;
  dayOfWeek?: number; // 0–6, for 'weekly'
  dayOfMonth?: number; // 1–31, for 'monthly'
}

export interface Chore {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null;
  startDate: string; // "YYYY-MM-DD"
  endDate: string | null;
  recurrence: Recurrence;
}
