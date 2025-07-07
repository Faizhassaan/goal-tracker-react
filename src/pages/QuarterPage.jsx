// src/pages/QuarterPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Box, Grid, Alert, Button,
  Card, CardContent, CardActions, Chip, IconButton, Menu, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppData } from '../context/AppDataContext';
import ProgressBar from '../components/ProgressBar';
import GoalForm from '../components/GoalForm';
import { formatDate } from '../utils/helpers';
import { Link as RouterLink } from 'react-router-dom';

const QuarterPage = () => {
  const { quarterId } = useParams();
  const { quarters, addGoal, updateGoal, deleteGoal, getGoalProgress } = useAppData();

  const quarter = quarters.find(q => q.id === quarterId);

  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [currentGoalToEdit, setCurrentGoalToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGoalForMenu, setSelectedGoalForMenu] = useState(null);

  const handleAddGoal = (formData) => {
    addGoal(quarterId, formData.title, formData.description, formData.deadline);
  };

  const handleEditGoal = (goal) => {
    setCurrentGoalToEdit(goal);
    setIsGoalFormOpen(true);
    handleMenuClose();
  };

  const handleUpdateGoal = (formData) => {
    updateGoal(currentGoalToEdit.id, formData);
  };

  const handleDeleteGoal = () => {
    if (selectedGoalForMenu) {
      deleteGoal(quarterId, selectedGoalForMenu.id);
    }
    handleMenuClose();
  };

  const handleMenuClick = (event, goal) => {
    setAnchorEl(event.currentTarget);
    setSelectedGoalForMenu(goal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGoalForMenu(null);
  };

  if (!quarter) {
    return <Alert severity="error">Quarter not found!</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {quarter.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {formatDate(quarter.startDate)} - {formatDate(quarter.endDate)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setCurrentGoalToEdit(null); setIsGoalFormOpen(true); }}
        >
          Add New Goal
        </Button>
      </Box>

      {quarter.goals.length === 0 ? (
        <Alert severity="info">No goals in this quarter yet. Add one to get started!</Alert>
      ) : (
        <Grid container spacing={3}>
          {quarter.goals.map((goal) => {
            const { percent, isCompleted } = getGoalProgress(goal.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isCompleted ? '2px solid' : '1px solid',
                    borderColor: isCompleted ? 'success.main' : 'divider',
                  }}
                >
                  <CardContent component={RouterLink} to={`/goal/${goal.id}`} sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {goal.title}
                      </Typography>
                      <Chip
                        label={isCompleted ? 'Completed' : 'In Progress'}
                        color={isCompleted ? 'success' : 'info'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {goal.description || 'No description.'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Deadline: {formatDate(goal.deadline)}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <ProgressBar value={percent} />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', pr: 2 }}>
                    <IconButton
                      aria-label="more"
                      onClick={(e) => handleMenuClick(e, goal)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedGoalForMenu?.id === goal.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEditGoal(goal)}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                      </MenuItem>
                      <MenuItem onClick={handleDeleteGoal}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    </Menu>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <GoalForm
        isOpen={isGoalFormOpen}
        onClose={() => setIsGoalFormOpen(false)}
        onSubmit={currentGoalToEdit ? handleUpdateGoal : handleAddGoal}
        initialData={currentGoalToEdit}
      />
    </Box>
  );
};

export default QuarterPage;