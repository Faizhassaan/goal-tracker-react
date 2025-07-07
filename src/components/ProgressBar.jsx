// src/components/ProgressBar.jsx
import React from 'react';
import { Box, LinearProgress, Typography, CircularProgress } from '@mui/material';

const ProgressBar = ({ value, type = 'linear', label, color = 'primary' }) => {
  if (type === 'circular') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
        <CircularProgress variant="determinate" value={value} color={color} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${value}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} color={color} sx={{ height: 8, borderRadius: 5 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${value}%`}</Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;