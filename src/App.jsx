// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import MainLayout from './layouts/MainLayout';
import QuarterPage from './pages/QuarterPage';
import GoalDetailPage from './pages/GoalDetailPage';
import { Typography, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <AppDataProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomeContent />} /> {/* Default Home */}
            <Route path="/quarter/:quarterId" element={<QuarterPage />} />
            <Route path="/goal/:goalId" element={<GoalDetailPage />} />
            <Route path="*" element={<NotFound />} /> {/* 404 Page */}
          </Routes>
        </MainLayout>
      </AppDataProvider>
    </Router>
  );
}

// Simple Home Content for when no quarter is selected
const HomeContent = () => {
  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary">
        Welcome to your Goal Tracker!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Select a quarter from the sidebar to view your goals, or click "New Quarter" to get started.
      </Typography>
    </Box>
  );
};

// Simple 404 Page
const NotFound = () => {
  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default App;