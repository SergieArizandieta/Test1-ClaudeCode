import { Box, Typography } from '@mui/material';
import { isToday } from 'date-fns';
import { Chore, TeamMember } from '../types';
import ChoreChip from './ChoreChip';

interface Props {
  date: Date | null; // null = padding cell
  chores: Chore[];
  members: TeamMember[];
  onChoreClick: (chore: Chore) => void;
  onAddChore: (date: Date) => void;
}

const MAX_VISIBLE = 3;

export default function CalendarDayCell({ date, chores, members, onChoreClick, onAddChore }: Props) {
  if (!date) {
    return <Box sx={{ bgcolor: 'grey.50', minHeight: 110, borderRight: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }} />;
  }

  const today = isToday(date);
  const overflow = chores.length - MAX_VISIBLE;

  return (
    <Box
      onClick={() => onAddChore(date)}
      sx={{
        minHeight: 110,
        p: 0.5,
        borderRight: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
        display: 'flex',
        flexDirection: 'column',
        gap: 0.25,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography
          variant="caption"
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            fontWeight: today ? 700 : 400,
            bgcolor: today ? 'primary.main' : 'transparent',
            color: today ? 'primary.contrastText' : 'text.primary',
            fontSize: '0.8rem',
          }}
        >
          {date.getDate()}
        </Typography>
      </Box>
      {chores.slice(0, MAX_VISIBLE).map((c) => (
        <ChoreChip key={c.id} chore={c} members={members} onClick={onChoreClick} />
      ))}
      {overflow > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', pl: 0.5 }}>
          +{overflow} more
        </Typography>
      )}
    </Box>
  );
}
