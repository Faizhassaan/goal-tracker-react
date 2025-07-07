// src/layouts/Sidebar.jsx
import React from 'react';
import {
  Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText,
  ListItemIcon, Box, Typography, IconButton, Menu, MenuItem
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppData } from '../context/AppDataContext';
import ProgressBar from '../components/ProgressBar';
import QuarterForm from '../components/QuarterForm';
import { useState } from 'react';
import { formatDate } from '../utils/helpers';

// Define the drawer width here or pass it as a prop from MainLayout
// const drawerWidth = 240; // Original width

const Sidebar = ({ drawerWidth }) => { // drawerWidth is now passed as a prop
  const { quarters, deleteQuarter, updateQuarter, getQuarterProgress } = useAppData();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuarterForMenu, setSelectedQuarterForMenu] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const handleMenuClick = (event, quarter) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuarterForMenu(quarter);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuarterForMenu(null);
  };

  const handleEditQuarter = () => {
    setIsEditFormOpen(true);
    handleMenuClose();
  };

  const handleDeleteQuarter = () => {
    if (selectedQuarterForMenu) {
      deleteQuarter(selectedQuarterForMenu.id);
    }
    handleMenuClose();
  };

  const handleUpdateQuarter = (formData) => {
    if (selectedQuarterForMenu) {
      updateQuarter(selectedQuarterForMenu.id, formData);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box'
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Your Quarters</Typography>
          <List>
            {quarters.map((quarter) => (
              <ListItem
                key={quarter.id}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="settings" onClick={(e) => handleMenuClick(e, quarter)}>
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/quarter/${quarter.id}`}
                  selected={location.pathname === `/quarter/${quarter.id}`}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={quarter.title}
                    secondary={`(${formatDate(quarter.startDate)} - ${formatDate(quarter.endDate)})`}
                  />
                  <Box sx={{ width: '80px', ml: 1 }}>
                    <ProgressBar value={getQuarterProgress(quarter.id)} type="linear" />
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditQuarter}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Quarter
        </MenuItem>
        <MenuItem onClick={handleDeleteQuarter}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Quarter
        </MenuItem>
      </Menu>

      {selectedQuarterForMenu && (
        <QuarterForm
          isOpen={isEditFormOpen}
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleUpdateQuarter}
          initialData={selectedQuarterForMenu}
        />
      )}
    </>
  );
};

export default Sidebar;