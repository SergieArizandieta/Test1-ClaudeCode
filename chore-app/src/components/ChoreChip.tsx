import { Chip } from '@mui/material';
import type { Chore, TeamMember } from '../types';

interface Props {
  chore: Chore;
  members: TeamMember[];
  onClick: (chore: Chore) => void;
}

export default function ChoreChip({ chore, members, onClick }: Props) {
  const member = members.find((m) => m.id === chore.assignedTo);
  const color = member?.color ?? '#90a4ae';

  return (
    <Chip
      label={chore.title}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onClick(chore);
      }}
      sx={{
        backgroundColor: color,
        color: '#fff',
        fontSize: '0.7rem',
        height: 20,
        maxWidth: '100%',
        cursor: 'pointer',
        '& .MuiChip-label': { px: 0.75, overflow: 'hidden', textOverflow: 'ellipsis' },
      }}
    />
  );
}
