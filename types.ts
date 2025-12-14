export enum ViewState {
  WELCOME = 'WELCOME',
  DASHBOARD = 'DASHBOARD',
  LIVE_SESSION = 'LIVE_SESSION',
  GOALS = 'GOALS',
  JOURNAL = 'JOURNAL',
  ZEN_ZONE = 'ZEN_ZONE',
  SETTINGS = 'SETTINGS'
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface MoodEntry {
  date: string;
  score: number; // 1-10
  energy: number; // 1-10
  note?: string;
  aiTip?: string;
  suggestedTasks?: TaskItem[];
}

export interface SubTask {
  title: string;
  estimatedTime: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number; // 0-100
  milestones: SubTask[];
  isAIGenerated: boolean;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedDates: string[]; // ISO date strings YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
  emotions: string[];
  tags: string[];
  aiInsight: string;
  actionableTip?: string;
  reflectionQuestion?: string;
}

export interface UserProfile {
  name: string;
  focusArea: string;
}