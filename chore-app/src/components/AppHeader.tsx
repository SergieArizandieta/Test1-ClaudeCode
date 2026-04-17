import { AppBar, Box, IconButton, Toolbar, Typography, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import { addMonths, subMonths, format } from 'date-fns';

interface Props {
  viewDate: Date;
  onViewDateChange: (d: Date) => void;
  onAddChore: () => void;
  onManageTeam: () => void;
}

export default function AppHeader({ viewDate, onViewDateChange, onAddChore, onManageTeam }: Props) {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 2 }}>
          Office Chores
        </Typography>

        <IconButton color="inherit" size="small" onClick={() => onViewDateChange(subMonths(viewDate, 1))}>
          <ChevronLeftIcon />
        </IconButton>

        <Typography variant="subtitle1" sx={{ minWidth: 150, textAlign: 'center', fontWeight: 500 }}>
          {format(viewDate, 'MMMM yyyy')}
        </Typography>

        <IconButton color="inherit" size="small" onClick={() => onViewDateChange(addMonths(viewDate, 1))}>
          <ChevronRightIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <Button
          color="inherit"
          startIcon={<GroupIcon />}
          onClick={onManageTeam}
          sx={{ textTransform: 'none' }}
        >
          Manage Team
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={onAddChore}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Add Chore
        </Button>
      </Toolbar>
    </AppBar>
  );
}
