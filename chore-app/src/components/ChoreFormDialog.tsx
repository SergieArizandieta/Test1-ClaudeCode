import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Stack, Box, Typography, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO } from 'date-fns';
import type { Chore, TeamMember, Recurrence, RecurrenceType } from '../types';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
  open: boolean;
  chore: Chore | null; // null = new chore
  defaultDate?: string; // "YYYY-MM-DD"
  members: TeamMember[];
  onSave: (chore: Chore) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function newChore(defaultDate?: string): Chore {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    assignedTo: null,
    startDate: defaultDate ?? format(new Date(), 'yyyy-MM-dd'),
    endDate: null,
    recurrence: { type: 'none' },
  };
}

export default function ChoreFormDialog({ open, chore, defaultDate, members, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<Chore>(newChore(defaultDate));

  useEffect(() => {
    if (open) setForm(chore ?? newChore(defaultDate));
  }, [open, chore, defaultDate]);

  const isNew = !chore;

  const setRecurrence = (patch: Partial<Recurrence>) =>
    setForm((f) => ({ ...f, recurrence: { ...f.recurrence, ...patch } }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {isNew ? 'Add Chore' : 'Edit Chore'}
        {!isNew && (
          <IconButton color="error" size="small" onClick={() => { onDelete(form.id); onClose(); }}>
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            required
            fullWidth
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />

          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              label="Assigned To"
              value={form.assignedTo ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value || null }))}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {members.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: m.color }} />
                    {m.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth>
            <InputLabel>Recurrence</InputLabel>
            <Select
              label="Recurrence"
              value={form.recurrence.type}
              onChange={(e) => setRecurrence({ type: e.target.value as RecurrenceType, dayOfWeek: undefined, dayOfMonth: undefined })}
            >
              <MenuItem value="none">None (one-time)</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          {form.recurrence.type === 'weekly' && (
            <FormControl fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                label="Day of Week"
                value={form.recurrence.dayOfWeek ?? parseISO(form.startDate).getDay()}
                onChange={(e) => setRecurrence({ dayOfWeek: Number(e.target.value) })}
              >
                {DAY_NAMES.map((d, i) => (
                  <MenuItem key={i} value={i}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {form.recurrence.type === 'monthly' && (
            <TextField
              label="Day of Month"
              type="number"
              fullWidth
              inputProps={{ min: 1, max: 31 }}
              value={form.recurrence.dayOfMonth ?? parseISO(form.startDate).getDate()}
              onChange={(e) => setRecurrence({ dayOfMonth: Math.min(31, Math.max(1, Number(e.target.value))) })}
            />
          )}

          {form.recurrence.type !== 'none' && (
            <TextField
              label="End Date (optional)"
              type="date"
              fullWidth
              value={form.endDate ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value || null }))}
              InputLabelProps={{ shrink: true }}
              helperText="Leave blank for no end date"
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!form.title.trim()}>
          {isNew ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
