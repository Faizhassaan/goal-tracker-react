// src/components/NotesEditor.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const NotesEditor = ({ initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleSave = () => {
    onSave(notes);
  };

  return (
    <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
      <TextField
        label="Notes"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="outlined" size="small" onClick={handleSave}>
        Save Notes
      </Button>
    </Box>
  );
};

export default NotesEditor;