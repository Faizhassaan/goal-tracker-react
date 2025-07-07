// src/pages/GoalDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Button, Alert, Chip,
  Tabs, Tab, List, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppData } from '../context/AppDataContext';
import ProgressBar from '../components/ProgressBar';
import TacticItem from '../components/TacticItem';
import ObstacleItem from '../components/ObstacleItem';
import { formatDate } from '../utils/helpers';

// Helper for Tactic/Obstacle Forms (simple inline dialogs for this example)
const GenericFormDialog = ({ isOpen, onClose, onSubmit, initialData = {}, fields, title }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {fields.map(field => (
          field.type === 'select' ? (
            <FormControl fullWidth margin="dense" key={field.name} sx={{ mb: 2 }}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={formData[field.name] || ''}
                label={field.label}
                onChange={handleChange}
              >
                {field.options.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              key={field.name}
              margin="dense"
              name={field.name}
              label={field.label}
              type={field.type || 'text'}
              fullWidth
              multiline={field.multiline}
              rows={field.rows}
              variant="outlined"
              value={formData[field.name] || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};


const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const {
    quarters, updateTactic, deleteTactic, addTactic,
    updateObstacle, deleteObstacle, addObstacle, getGoalProgress
  } = useAppData();

  // Find the goal by iterating through all quarters' goals
  const goal = quarters.flatMap(q => q.goals).find(g => g.id === goalId);

  const [currentTab, setCurrentTab] = useState(0); // 0 for Tactics, 1 for Obstacles
  const [isTacticFormOpen, setIsTacticFormOpen] = useState(false);
  const [currentTacticToEdit, setCurrentTacticToEdit] = useState(null);
  const [isObstacleFormOpen, setIsObstacleFormOpen] = useState(false);
  const [currentObstacleToEdit, setCurrentObstacleToEdit] = useState(null);

  useEffect(() => {
    if (!goal) {
      // If goal not found, navigate back or to a 404 page
      navigate('/');
    }
  }, [goal, navigate]);

  if (!goal) {
    return <Alert severity="error">Goal not found!</Alert>;
  }

  const { percent, isCompleted } = getGoalProgress(goal.id);

  const handleAddTactic = (formData) => {
    addTactic(goal.id, formData.title);
  };

  const handleUpdateTactic = (tacticId, updates) => {
    updateTactic(tacticId, updates);
  };

  const handleDeleteTactic = (tacticId) => {
    deleteTactic(goal.id, tacticId);
  };

  const handleEditTactic = (tactic) => {
    setCurrentTacticToEdit(tactic);
    setIsTacticFormOpen(true);
  };


  const handleAddObstacle = (formData) => {
    addObstacle(goal.id, formData.description, formData.linkedTacticId || null);
  };

  const handleUpdateObstacle = (obstacleId, updates) => {
    updateObstacle(obstacleId, updates);
  };

  const handleDeleteObstacle = (obstacleId) => {
    deleteObstacle(goal.id, obstacleId);
  };

  const handleEditObstacle = (obstacle) => {
    setCurrentObstacleToEdit(obstacle);
    setIsObstacleFormOpen(true);
  };

  // Fields for Tactic Form
  const tacticFormFields = [
    { name: 'title', label: 'Tactic Title', type: 'text' },
  ];

  // Fields for Obstacle Form
  const obstacleFormFields = [
    { name: 'description', label: 'Description', type: 'text', multiline: true, rows: 3 },
    {
      name: 'linkedTacticId',
      label: 'Link to Tactic (Optional)',
      type: 'select',
      options: [
        { value: '', label: 'None' },
        ...goal.tactics.map(t => ({ value: t.id, label: t.title }))
      ]
    }
  ];


  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => navigate(`/quarter/${goal.quarterId}`)}
        sx={{ mb: 2 }}
      >
        &larr; Back to Quarter
      </Button>

      <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="h1">
            {goal.title}
          </Typography>
          <Chip
            label={isCompleted ? 'Completed' : 'In Progress'}
            color={isCompleted ? 'success' : 'info'}
            size="medium"
          />
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {goal.description || 'No description provided.'}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Deadline: {formatDate(goal.deadline)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <ProgressBar value={percent} type="linear" />
        </Box>
      </Box>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} aria-label="goal sections tabs">
        <Tab label={`Tactics (${goal.tactics.length})`} />
        <Tab label={`Obstacles (${goal.obstacles.length})`} />
      </Tabs>

      {/* Tactics Section */}
      {currentTab === 0 && (
        <Box sx={{ pt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setCurrentTacticToEdit(null); setIsTacticFormOpen(true); }}
            sx={{ mb: 2 }}
          >
            Add New Tactic
          </Button>
          {goal.tactics.length === 0 ? (
            <Alert severity="info">No tactics added for this goal yet.</Alert>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
              {goal.tactics.map(tactic => (
                <TacticItem
                  key={tactic.id}
                  tactic={tactic}
                  onToggleComplete={handleUpdateTactic}
                  onUpdate={handleUpdateTactic}
                  onDelete={handleDeleteTactic}
                />
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Obstacles Section */}
      {currentTab === 1 && (
        <Box sx={{ pt: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setCurrentObstacleToEdit(null); setIsObstacleFormOpen(true); }}
            sx={{ mb: 2 }}
          >
            Add New Obstacle
          </Button>
          {goal.obstacles.length === 0 ? (
            <Alert severity="info">No obstacles added for this goal yet.</Alert>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1 }}>
              {goal.obstacles.map(obstacle => (
                <ObstacleItem
                  key={obstacle.id}
                  obstacle={obstacle}
                  onToggleOvercome={handleUpdateObstacle}
                  onUpdate={handleUpdateObstacle}
                  onDelete={handleDeleteObstacle}
                  allTactics={goal.tactics} // Pass tactics to allow linking
                />
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Tactic Form Dialog */}
      <GenericFormDialog
        isOpen={isTacticFormOpen}
        onClose={() => setIsTacticFormOpen(false)}
        onSubmit={currentTacticToEdit ? (data) => handleUpdateTactic(currentTacticToEdit.id, data) : handleAddTactic}
        initialData={currentTacticToEdit || { title: '' }}
        fields={tacticFormFields}
        title={currentTacticToEdit ? 'Edit Tactic' : 'Add New Tactic'}
      />

      {/* Obstacle Form Dialog */}
      <GenericFormDialog
        isOpen={isObstacleFormOpen}
        onClose={() => setIsObstacleFormOpen(false)}
        onSubmit={currentObstacleToEdit ? (data) => handleUpdateObstacle(currentObstacleToEdit.id, data) : handleAddObstacle}
        initialData={currentObstacleToEdit || { description: '', linkedTacticId: '' }}
        fields={obstacleFormFields}
        title={currentObstacleToEdit ? 'Edit Obstacle' : 'Add New Obstacle'}
      />
    </Box>
  );
};

export default GoalDetailPage;