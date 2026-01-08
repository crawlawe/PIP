export type Duration = number;

export const CATEGORIES = ['STRENGTH', 'INTELLIGENCE', 'WEALTH', 'HEALTH', 'OTHER'] as const;
export type CategoryType = typeof CATEGORIES[number];

export interface Quest {
  id: string;
  name: string;
  duration: Duration; // Replaces difficulty. 1 min = 1 XP.
  category: string; // Can be one of CATEGORIES or a custom string if 'OTHER' was selected
  history: Record<string, boolean>; // 'YYYY-MM-DD' -> true
}

export interface AppState {
  quests: Quest[];
  totalXP: number;
  level: number;
}

export const STORAGE_KEY = 'PIPBOY_RPG_DATA_V1';