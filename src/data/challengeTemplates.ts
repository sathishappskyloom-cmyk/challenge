import { ChallengeTemplate } from '../types/Challenge';

export const challengeTemplates: ChallengeTemplate[] = [
  {
    id: 'template-1',
    title: '30-Day Pushup Challenge',
    description: 'Build upper body strength with progressive pushup training',
    icon: 'Dumbbell',
    category: 'Fitness',
    defaultDuration: 30,
    sampleData: [
      ['Day', 'Target Pushups', 'Completed', 'Status'],
      ['1', '10', '✅', '✅'],
      ['2', '12', '✅', '✅'],
      ['3', '15', '', '⏳'],
      ['4', '17', '', '⏳'],
      ['5', '20', '', '⏳']
    ]
  },
  {
    id: 'template-2',
    title: '21-Day Reading Challenge',
    description: 'Develop a consistent reading habit over 21 days',
    icon: 'BookOpen',
    category: 'Study',
    defaultDuration: 21,
    sampleData: [
      ['Day', 'Book', 'Pages Read', 'Notes', 'Completed'],
      ['1', 'Atomic Habits', '25', 'Great insights on habit formation', '✅'],
      ['2', 'Atomic Habits', '30', 'The habit loop explained', '✅'],
      ['3', 'Atomic Habits', '', '', '⏳'],
      ['4', 'Atomic Habits', '', '', '⏳']
    ]
  },
  {
    id: 'template-3',
    title: '7-Day Water Challenge',
    description: 'Stay hydrated with 8 glasses of water daily',
    icon: 'Droplets',
    category: 'Health',
    defaultDuration: 7,
    sampleData: [
      ['Day', 'Target (glasses)', 'Morning', 'Afternoon', 'Evening', 'Total', 'Goal Met'],
      ['1', '8', '3', '3', '2', '8', '✅'],
      ['2', '8', '2', '4', '2', '8', '✅'],
      ['3', '8', '', '', '', '', '⏳']
    ]
  },
  {
    id: 'template-4',
    title: '14-Day Meditation Challenge',
    description: 'Build mindfulness through daily meditation practice',
    icon: 'Brain',
    category: 'Wellness',
    defaultDuration: 14,
    sampleData: [
      ['Day', 'Duration (min)', 'Type', 'Mood Before', 'Mood After', 'Completed'],
      ['1', '10', 'Breathing', '6/10', '8/10', '✅'],
      ['2', '10', 'Body Scan', '5/10', '7/10', '✅'],
      ['3', '15', 'Mindfulness', '', '', '⏳']
    ]
  }
];