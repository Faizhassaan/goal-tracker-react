// src/components/GoalForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';

const GoalForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [status, setStatus] = useState('in-progress');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline ? parseISO(initialData.deadline) : null);
      setStatus(initialData.status || 'in-progress');
    } else {
      setTitle('');
      setDescription('');
      setDeadline(null);
      setStatus('in-progress');
    }
    setError('');
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!title.trim() || !deadline) {
      setError('Title and Deadline are required.');
      return;
    }
    if (deadline < new Date() && status === 'in-progress' && !initialData) { // Only warn for new goals
      // setError('Deadline is in the past for an in-progress goal.');
      // return; // Or just warn but allow
    }

    setError('');
    onSubmit({
      title,
      description,
      deadline: format(deadline, 'yyyy-MM-dd'),
      status,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Goal Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Deadline"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            slotProps={{ textField: { fullWidth: true, margin: "dense", sx: { mb: 2 } } }}
          />
        </LocalizationProvider>
        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Save Changes' : 'Add Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalForm;