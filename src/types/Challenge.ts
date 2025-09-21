export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  excelFile: string;
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  endDate: string;
  totalDays: number;
  completedDays?: number;
  streak?: number;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  defaultDuration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  sampleData: any[][];
  tips: string[];
}

export interface FilterState {
  status: string;
  category: string;
  search: string;
  difficulty: string;
  priority: string;
  tags: string[];
  sortBy: 'startDate' | 'endDate' | 'status' | 'title' | 'priority' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

export interface Statistics {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  completionRate: number;
  averageStreak: number;
  totalDaysTracked: number;
  categoryCounts: { [key: string]: number };
  difficultyDistribution: { [key: string]: number };
  monthlyProgress: { month: string; completed: number; started: number }[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  value: number;
  completed: boolean;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}