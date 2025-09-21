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
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  defaultDuration: number;
  sampleData: any[][];
}

export interface FilterState {
  status: string;
  category: string;
  search: string;
  sortBy: 'startDate' | 'endDate' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface Statistics {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  completionRate: number;
  categoryCounts: { [key: string]: number };
}