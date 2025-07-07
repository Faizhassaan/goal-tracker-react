// src/layouts/MainLayout.jsx
import React from 'react';
import {
  AppBar, Toolbar, Typography, Box,
  CssBaseline, Container, useTheme, IconButton
} from '@mui/material';
import Sidebar from './Sidebar';
import AddIcon from '@mui/icons-material/Add';
import { useAppData } from '../context/AppDataContext';
import QuarterForm from '../components/QuarterForm';
import { useState } from 'react';

// Change this value to your desired width
const drawerWidth = 300; // For example, increased from 240 to 300px

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const { addQuarter } = useAppData();
  const [isQuarterFormOpen, setIsQuarterFormOpen] = useState(false);

  const handleAddQuarter = (formData) => {
    addQuarter(formData.title, formData.startDate, formData.endDate);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Goal Tracker
          </Typography>
          <IconButton color="inherit" onClick={() => setIsQuarterFormOpen(true)}>
            <AddIcon />
            <Typography variant="body2" sx={{ ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
              New Quarter
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Pass the updated drawerWidth to the Sidebar */}
      <Sidebar drawerWidth={drawerWidth} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: `${theme.mixins.toolbar.minHeight + 24}px`, // Adjust for AppBar height
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      <QuarterForm
        isOpen={isQuarterFormOpen}
        onClose={() => setIsQuarterFormOpen(false)}
        onSubmit={handleAddQuarter}
      />
    </Box>
  );
};

export default MainLayout;