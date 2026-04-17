import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { TeamMember, Chore } from '../types';
import { MEMBER_COLORS, getNextColor } from '../utils/colors';

interface Props {
  open: boolean;
  members: TeamMember[];
  chores: Chore[];
  onAddMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onClose: () => void;
}

export default function MemberManagerDialog({ open, members, chores, onAddMember, onDeleteMember, onClose }: Props) {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    const color = selectedColor || getNextColor(members.map((m) => m.color));
    onAddMember({ id: crypto.randomUUID(), name, color });
    setNewName('');
    setSelectedColor('');
  };

  const choreCountFor = (id: string) => chores.filter((c) => c.assignedTo === id).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Manage Team</DialogTitle>
      <DialogContent>
        <List dense disablePadding>
          {members.map((m) => (
            <ListItem
              key={m.id}
              secondaryAction={
                <Tooltip title={choreCountFor(m.id) > 0 ? `${choreCountFor(m.id)} chore(s) will become unassigned` : 'Remove member'}>
                  <IconButton edge="end" size="small" color="error" onClick={() => onDeleteMember(m.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              }
              disableGutters
              sx={{ mb: 0.5 }}
            >
              <ListItemAvatar sx={{ minWidth: 36 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: m.color, fontSize: '0.8rem' }}>
                  {m.name[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={m.name}
                secondary={choreCountFor(m.id) > 0 ? `${choreCountFor(m.id)} chore(s)` : undefined}
              />
            </ListItem>
          ))}
          {members.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No team members yet.
            </Typography>
          )}
        </List>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Add Member</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              sx={{ flex: 1 }}
            />
            <IconButton color="primary" onClick={handleAdd} disabled={!newName.trim()}>
              <AddIcon />
            </IconButton>
          </Box>

          {/* Color picker */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 1.5 }}>
            {MEMBER_COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => setSelectedColor(c)}
                sx={{
                  width: 24, height: 24, borderRadius: '50%', bgcolor: c,
                  cursor: 'pointer',
                  outline: selectedColor === c ? `3px solid` : 'none',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                }}
              />
            ))}
          </Box>
          {!selectedColor && (
            <Typography variant="caption" color="text.secondary">
              No color selected — one will be assigned automatically.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
