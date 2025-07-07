// src/context/AppDataContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import { getQuarterProgress, getGoalProgress } from '../utils/progressCalculations';

const AppDataContext = createContext(undefined);

export const AppDataProvider = ({ children }) => {
  // Initialize with an empty array. If localStorage has data, it will be loaded.
  const [quarters, setQuarters] = useLocalStorage('goalTrackerQuarters', []);

  // --- Quarter Operations ---
  const addQuarter = useCallback((title, startDate, endDate) => {
    const newQuarter = {
      id: uuidv4(),
      title,
      startDate,
      endDate,
      goals: [],
    };
    setQuarters((prev) => [...prev, newQuarter]);
  }, [setQuarters]);

  const updateQuarter = useCallback((id, updates) => {
    setQuarters((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  }, [setQuarters]);

  const deleteQuarter = useCallback((id) => {
    setQuarters((prev) => prev.filter((q) => q.id !== id));
  }, [setQuarters]);

  // --- Goal Operations ---
  const addGoal = useCallback((quarterId, title, description, deadline) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => {
        if (q.id === quarterId) {
          const newGoal = {
            id: uuidv4(),
            title,
            description,
            deadline,
            status: 'in-progress',
            tactics: [],
            obstacles: [],
            quarterId: q.id,
          };
          return { ...q, goals: [...q.goals, newGoal] };
        }
        return q;
      })
    );
  }, [setQuarters]);

  const updateGoal = useCallback((goalId, updates) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => {
          // If the status is being updated to 'completed', ensure all tactics are marked complete
          if (g.id === goalId && updates.status === 'completed') {
            return {
              ...g,
              ...updates,
              tactics: g.tactics.map(t => ({ ...t, isCompleted: true })),
              obstacles: g.obstacles.map(o => ({ ...o, isOvercome: true }))
            };
          }
          return g.id === goalId ? { ...g, ...updates } : g;
        }),
      }))
    );
  }, [setQuarters]);

  const deleteGoal = useCallback((quarterId, goalId) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => {
        if (q.id === quarterId) {
          return { ...q, goals: q.goals.filter((g) => g.id !== goalId) };
        }
        return q;
      })
    );
  }, [setQuarters]);

  // --- Tactic Operations ---
  const addTactic = useCallback((goalId, title) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => {
          if (g.id === goalId) {
            const newTactic = {
              id: uuidv4(),
              title,
              isCompleted: false,
              notes: '',
              goalId: g.id,
            };
            return { ...g, tactics: [...g.tactics, newTactic] };
          }
          return g;
        }),
      }))
    );
  }, [setQuarters]);

  const updateTactic = useCallback((tacticId, updates) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => ({
          ...g,
          tactics: g.tactics.map((t) => (t.id === tacticId ? { ...t, ...updates } : t)),
        })),
      }))
    );
  }, [setQuarters]);

  const deleteTactic = useCallback((goalId, tacticId) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => {
          if (g.id === goalId) {
            return { ...g, tactics: g.tactics.filter((t) => t.id !== tacticId) };
          }
          return g;
        }),
      }))
    );
  }, [setQuarters]);

  // --- Obstacle Operations ---
  const addObstacle = useCallback((goalId, description, linkedTacticId = null) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => {
          if (g.id === goalId) {
            const newObstacle = {
              id: uuidv4(),
              description,
              isOvercome: false,
              goalId: g.id,
              linkedTacticId,
            };
            return { ...g, obstacles: [...g.obstacles, newObstacle] };
          }
          return g;
        }),
      }))
    );
  }, [setQuarters]);

  const updateObstacle = useCallback((obstacleId, updates) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => ({
          ...g,
          obstacles: g.obstacles.map((o) => (o.id === obstacleId ? { ...o, ...updates } : o)),
        })),
      }))
    );
  }, [setQuarters]);

  const deleteObstacle = useCallback((goalId, obstacleId) => {
    setQuarters((prevQuarters) =>
      prevQuarters.map((q) => ({
        ...q,
        goals: q.goals.map((g) => {
          if (g.id === goalId) {
            return { ...g, obstacles: g.obstacles.filter((o) => o.id !== obstacleId) };
          }
          return g;
        }),
      }))
    );
  }, [setQuarters]);

  // Effect to update goal status automatically based on tactic/obstacle completion
  useEffect(() => {
    setQuarters(currentQuarters => {
      let quartersChanged = false;
      const updatedQuarters = currentQuarters.map(q => {
        let quarterGoalsChanged = false;
        const updatedGoals = q.goals.map(g => {
          const { isCompleted: isGoalNowCompleted } = getGoalProgress(g);
          const currentStatus = g.status;

          // Only update if status needs changing
          if (isGoalNowCompleted && currentStatus !== 'completed') {
            quarterGoalsChanged = true;
            return { ...g, status: 'completed' };
          } else if (!isGoalNowCompleted && currentStatus === 'completed') {
            // If it was completed but now not (e.g., tactic un-checked)
            quarterGoalsChanged = true;
            return { ...g, status: 'in-progress' };
          }
          return g;
        });
        if (quarterGoalsChanged) {
          quartersChanged = true;
          return { ...q, goals: updatedGoals };
        }
        return q;
      });

      return quartersChanged ? updatedQuarters : currentQuarters;
    });
  }, [quarters, setQuarters]); // Dependency on quarters state, triggers on any data change

  const contextValue = {
    quarters,
    addQuarter,
    updateQuarter,
    deleteQuarter,
    getQuarterProgress: (quarterId) => getQuarterProgress(quarters, quarterId),
    addGoal,
    updateGoal,
    deleteGoal,
    getGoalProgress: (goalId) => {
      const allGoals = quarters.flatMap(q => q.goals);
      const goal = allGoals.find(g => g.id === goalId);
      return goal ? getGoalProgress(goal) : { percent: 0, isCompleted: false };
    },
    addTactic,
    updateTactic,
    deleteTactic,
    addObstacle,
    updateObstacle,
    deleteObstacle,
  };

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};