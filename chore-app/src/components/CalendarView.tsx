import { Box, Typography } from '@mui/material';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
} from 'date-fns';
import { Chore, TeamMember } from '../types';
import { getChoresForMonth } from '../utils/choreOccurrences';
import CalendarDayCell from './CalendarDayCell';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  viewDate: Date;
  chores: Chore[];
  members: TeamMember[];
  onChoreClick: (chore: Chore) => void;
  onAddChore: (date: Date) => void;
}

export default function CalendarView({ viewDate, chores, members, onChoreClick, onAddChore }: Props) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const choreMap = getChoresForMonth(chores, year, month);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // Pad to full weeks (already done by eachDayOfInterval)
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {/* Day-of-week header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid', borderLeft: '1px solid', borderColor: 'divider' }}>
        {DAY_LABELS.map((label) => (
          <Box key={label} sx={{ py: 1, textAlign: 'center', borderRight: '1px solid', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.100' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <Box key={wi} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid', borderColor: 'divider' }}>
          {week.map((day, di) => {
            const inMonth = day ? isSameMonth(day, viewDate) : false;
            const dateStr = day ? format(day, 'yyyy-MM-dd') : null;
            const dayChores = dateStr ? (choreMap.get(dateStr) ?? []) : [];
            return (
              <Box key={di} sx={{ opacity: inMonth ? 1 : 0.35 }}>
                <CalendarDayCell
                  date={day}
                  chores={dayChores}
                  members={members}
                  onChoreClick={onChoreClick}
                  onAddChore={onAddChore}
                />
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
