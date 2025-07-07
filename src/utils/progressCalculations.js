// src/utils/progressCalculations.js

export const getGoalProgress = (goal) => {
  if (!goal || (!goal.tactics || goal.tactics.length === 0) && (!goal.obstacles || goal.obstacles.length === 0)) {
    return { percent: 0, isCompleted: false };
  }

  const completedTactics = (goal.tactics || []).filter(tactic => tactic.isCompleted).length;
  const totalTactics = (goal.tactics || []).length;
  const overcomeObstacles = (goal.obstacles || []).filter(obstacle => obstacle.isOvercome).length;
  const totalObstacles = (goal.obstacles || []).length;

  let tacticProgress = 0;
  if (totalTactics > 0) {
    tacticProgress = (completedTactics / totalTactics) * 100;
  }

  let obstacleProgress = 0;
  if (totalObstacles > 0) {
    obstacleProgress = (overcomeObstacles / totalObstacles) * 100;
  }

  // A goal is considered complete when ALL tactics are done AND ALL obstacles are overcome
  const isGoalTrulyCompleted =
    (totalTactics === 0 || completedTactics === totalTactics) &&
    (totalObstacles === 0 || overcomeObstacles === totalObstacles);

  let overallPercent = 0;
  if (totalTactics > 0 && totalObstacles > 0) {
      overallPercent = (tacticProgress + obstacleProgress) / 2;
  } else if (totalTactics > 0) {
      overallPercent = tacticProgress;
  } else if (totalObstacles > 0) {
      overallPercent = obstacleProgress;
  }

  // If truly completed, ensure percent is 100
  if (isGoalTrulyCompleted) {
      overallPercent = 100;
  }

  return {
    percent: Math.round(overallPercent),
    isCompleted: isGoalTrulyCompleted
  };
};

export const getQuarterProgress = (quarters, quarterId) => {
  const quarter = quarters.find(q => q.id === quarterId);
  if (!quarter || !quarter.goals || quarter.goals.length === 0) {
    return 0;
  }

  const totalGoals = quarter.goals.length;
  let totalGoalProgressSum = 0;

  quarter.goals.forEach(goal => {
    const { percent } = getGoalProgress(goal);
    totalGoalProgressSum += percent;
  });

  return Math.round(totalGoalProgressSum / totalGoals);
};