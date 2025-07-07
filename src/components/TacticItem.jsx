// src/components/TacticItem.jsx
import React, { useState } from 'react';
import {
  ListItem, ListItemText, Checkbox, IconButton,
  Box, Menu, MenuItem, TextField, Collapse
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';
import NotesEditor from './NotesEditor';

const TacticItem = ({ tactic, onUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(tactic.title);
  const [showNotes, setShowNotes] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setAnchorEl(null);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(tactic.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(tactic.title);
    setIsEditing(false);
  };

  const handleNotesUpdate = (newNotes) => {
    onUpdate(tactic.id, { notes: newNotes });
  };

  return (
    <ListItem
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
      secondaryAction={
        <Box>
          <IconButton edge="end" aria-label="notes" onClick={() => setShowNotes(!showNotes)}>
            <NotesIcon color={tactic.notes ? 'primary' : 'action'} />
          </IconButton>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { onDelete(tactic.id); handleMenuClose(); }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      }
    >
      <Checkbox
        edge="start"
        checked={tactic.isCompleted}
        tabIndex={-1}
        disableRipple
        onChange={() => onUpdate(tactic.id, { isCompleted: !tactic.isCompleted })}
      />
      {isEditing ? (
        <TextField
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
          autoFocus
          variant="standard"
          fullWidth
          sx={{ mr: 1 }}
        />
      ) : (
        <ListItemText
          primary={tactic.title}
          sx={{
            textDecoration: tactic.isCompleted ? 'line-through' : 'none',
            color: tactic.isCompleted ? 'text.secondary' : 'inherit'
          }}
        />
      )}
      <Collapse in={showNotes} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <NotesEditor initialNotes={tactic.notes} onSave={handleNotesUpdate} />
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default TacticItem;
