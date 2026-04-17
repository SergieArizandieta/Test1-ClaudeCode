import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { format } from 'date-fns';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Chore, TeamMember } from './types';
import AppHeader from './components/AppHeader';
import CalendarView from './components/CalendarView';
import ChoreFormDialog from './components/ChoreFormDialog';
import MemberManagerDialog from './components/MemberManagerDialog';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6f00' },
  },
});

export default function App() {
  const [members, setMembers] = useLocalStorage<TeamMember[]>('chore-app:members', []);
  const [chores, setChores] = useLocalStorage<Chore[]>('chore-app:chores', []);

  const [viewDate, setViewDate] = useState(new Date());
  const [choreDialogOpen, setChoreDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);

  const openAddChore = (date?: Date) => {
    setEditingChore(null);
    setDefaultDate(date ? format(date, 'yyyy-MM-dd') : undefined);
    setChoreDialogOpen(true);
  };

  const openEditChore = (chore: Chore) => {
    setEditingChore(chore);
    setDefaultDate(undefined);
    setChoreDialogOpen(true);
  };

  const handleSaveChore = (chore: Chore) => {
    setChores((prev) => {
      const idx = prev.findIndex((c) => c.id === chore.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = chore;
        return next;
      }
      return [...prev, chore];
    });
    setChoreDialogOpen(false);
  };

  const handleDeleteChore = (id: string) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddMember = (member: TeamMember) => {
    setMembers((prev) => [...prev, member]);
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setChores((prev) => prev.map((c) => c.assignedTo === id ? { ...c, assignedTo: null } : c));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <AppHeader
          viewDate={viewDate}
          onViewDateChange={setViewDate}
          onAddChore={() => openAddChore()}
          onManageTeam={() => setMemberDialogOpen(true)}
        />
        <CalendarView
          viewDate={viewDate}
          chores={chores}
          members={members}
          onChoreClick={openEditChore}
          onAddChore={openAddChore}
        />
      </Box>

      <ChoreFormDialog
        open={choreDialogOpen}
        chore={editingChore}
        defaultDate={defaultDate}
        members={members}
        onSave={handleSaveChore}
        onDelete={handleDeleteChore}
        onClose={() => setChoreDialogOpen(false)}
      />

      <MemberManagerDialog
        open={memberDialogOpen}
        members={members}
        chores={chores}
        onAddMember={handleAddMember}
        onDeleteMember={handleDeleteMember}
        onClose={() => setMemberDialogOpen(false)}
      />
    </ThemeProvider>
  );
}
