// src/data/initialData.js
import { v4 as uuidv4 } from 'uuid';

export const initialQuarters = [
  {
    id: uuidv4(),
    title: 'Q3 2024: Personal Growth',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    goals: [
      {
        id: uuidv4(),
        title: 'Read 3 Books on AI',
        description: 'Deepen understanding of machine learning and neural networks.',
        deadline: '2024-09-15',
        status: 'in-progress',
        quarterId: '', // Will be set by context
        tactics: [
          { id: uuidv4(), title: 'Finish "Deep Learning"', isCompleted: true, notes: 'Completed on Aug 1st, 2024. Very insightful chapters on CNNs.' },
          { id: uuidv4(), title: 'Read "Generative AI"', isCompleted: false, notes: 'Need to allocate dedicated time for this one.' },
          { id: uuidv4(), title: 'Review "Pattern Recognition"', isCompleted: false, notes: '' },
        ],
        obstacles: [
          { id: uuidv4(), description: 'Lack of dedicated reading time.', isOvercome: false, linkedTacticId: null },
          { id: uuidv4(), description: 'Complex mathematical concepts.', isOvercome: true, linkedTacticId: null },
        ],
      },
      {
        id: uuidv4(),
        title: 'Start a Side Project',
        description: 'Build a small web app using new technologies.',
        deadline: '2024-09-30',
        status: 'in-progress',
        quarterId: '',
        tactics: [
          { id: uuidv4(), title: 'Choose project idea', isCompleted: true, notes: 'Decided on a simple task manager.' },
          { id: uuidv4(), title: 'Set up development environment', isCompleted: false, notes: '' },
          { id: uuidv4(), title: 'Complete MVP features', isCompleted: false, notes: '' },
        ],
        obstacles: [
          { id: uuidv4(), description: 'Difficulty choosing an idea.', isOvercome: true, linkedTacticId: null },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Q4 2024: Health & Fitness',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    goals: [
      {
        id: uuidv4(),
        title: 'Run a 5K',
        description: 'Complete a local 5K race.',
        deadline: '2024-11-15',
        status: 'in-progress',
        quarterId: '',
        tactics: [
          { id: uuidv4(), title: 'Train 3 times a week', isCompleted: false, notes: '' },
          { id: uuidv4(), title: 'Follow training plan', isCompleted: false, notes: '' },
        ],
        obstacles: [
          { id: uuidv4(), description: 'Cold weather in late fall.', isOvercome: false, linkedTacticId: null },
        ],
      },
    ],
  },
];

// Assign correct quarter IDs to goals
initialQuarters.forEach(quarter => {
  quarter.goals.forEach(goal => {
    goal.quarterId = quarter.id;
  });
});