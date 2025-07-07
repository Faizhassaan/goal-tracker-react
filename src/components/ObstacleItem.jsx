// src/components/ObstacleItem.jsx
import React, { useState } from 'react';
import {
  ListItem, ListItemText, Checkbox, IconButton, Box,
  Menu, MenuItem, TextField, Typography, Chip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ObstacleItem = ({ obstacle, onUpdate, onDelete, allTactics = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(obstacle.description);

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
    if (editDescription.trim()) {
      onUpdate(obstacle.id, { description: editDescription.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDescription(obstacle.description);
    setIsEditing(false);
  };

  const linkedTactic = allTactics.find(t => t.id === obstacle.linkedTacticId);

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
            <MenuItem onClick={() => { onDelete(obstacle.id); handleMenuClose(); }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      }
    >
      {/* Toggle isOvercome when checkbox is clicked */}
      <Checkbox
        edge="start"
        checked={obstacle.isOvercome}
        tabIndex={-1}
        disableRipple
        onChange={() => onUpdate(obstacle.id, { isOvercome: !obstacle.isOvercome })}
      />
      <ListItemText
        sx={{
          textDecoration: obstacle.isOvercome ? 'line-through' : 'none',
          color: obstacle.isOvercome ? 'text.secondary' : 'inherit'
        }}
      >
        {isEditing ? (
          <TextField
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
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
          <Typography>{obstacle.description}</Typography>
        )}
        {linkedTactic && (
          <Chip
            label={`Linked to: ${linkedTactic.title}`}
            size="small"
            color="info"
            sx={{ mt: 0.5 }}
          />
        )}
      </ListItemText>
    </ListItem>
  );
};

export default ObstacleItem;
