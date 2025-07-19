// RFC 5545 Game Progression Data

export interface Chapter {
  id: string;
  title: string;
  description: string;
  rfcSection: string;
  levels: Level[];
  unlocked: boolean;
  completionPercentage: number;
}

export interface Level {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  type: 'tutorial' | 'practice' | 'challenge' | 'boss';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0-3 stars based on performance
}

export interface Challenge {
  id: string;
  levelId: string;
  title: string;
  instructions: string;
  startingCode?: string;
  solution: string;
  hints: string[];
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  description: string;
  test: (input: string) => boolean;
  errorMessage: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface PlayerProgress {
  currentLevel: number;
  totalXP: number;
  achievements: string[]; // achievement IDs
  completedLevels: string[]; // level IDs
  unlockedChapters: string[]; // chapter IDs
  statistics: GameStatistics;
}

export interface GameStatistics {
  totalPlayTime: number;
  challengesCompleted: number;
  perfectScores: number;
  hintsUsed: number;
  errorsFixed: number;
  calendarsCreated: number;
}

// Initial game chapters based on RFC 5545 structure
export const gameChapters: Chapter[] = [
  {
    id: 'basics',
    title: 'The Basics',
    description: 'Introduction to iCalendar format and basic structure',
    rfcSection: '1-2',
    unlocked: true,
    completionPercentage: 0,
    levels: [
      {
        id: 'basics-1',
        chapterId: 'basics',
        title: 'Welcome to iCalendar',
        description: 'Learn what iCalendar is and why it matters',
        type: 'tutorial',
        difficulty: 'beginner',
        xpReward: 100,
        unlocked: true,
        completed: false,
        stars: 0
      },
      {
        id: 'basics-2',
        chapterId: 'basics',
        title: 'Your First Calendar',
        description: 'Create a simple VCALENDAR structure',
        type: 'practice',
        difficulty: 'beginner',
        xpReward: 150,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'basics-3',
        chapterId: 'basics',
        title: 'Calendar Properties',
        description: 'Add VERSION and PRODID properties',
        type: 'practice',
        difficulty: 'beginner',
        xpReward: 150,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'basics-boss',
        chapterId: 'basics',
        title: 'Fix the Broken Calendar',
        description: 'Debug and fix a corrupted calendar file',
        type: 'boss',
        difficulty: 'intermediate',
        xpReward: 300,
        unlocked: false,
        completed: false,
        stars: 0
      }
    ]
  },
  {
    id: 'datatypes',
    title: 'Property Value Data Types',
    description: 'Master all iCalendar data types',
    rfcSection: '3.3',
    unlocked: false,
    completionPercentage: 0,
    levels: [
      {
        id: 'datatypes-1',
        chapterId: 'datatypes',
        title: 'Text and Binary Types',
        description: 'Learn TEXT and BINARY data types',
        type: 'tutorial',
        difficulty: 'beginner',
        xpReward: 150,
        unlocked: true,
        completed: false,
        stars: 0
      },
      {
        id: 'datatypes-2',
        chapterId: 'datatypes',
        title: 'Date and Time Types',
        description: 'Master DATE, DATE-TIME, and TIME types',
        type: 'practice',
        difficulty: 'intermediate',
        xpReward: 200,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'datatypes-3',
        chapterId: 'datatypes',
        title: 'Duration and Period',
        description: 'Work with DURATION and PERIOD types',
        type: 'practice',
        difficulty: 'intermediate',
        xpReward: 200,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'datatypes-4',
        chapterId: 'datatypes',
        title: 'Recurrence Rules',
        description: 'Introduction to RECUR data type',
        type: 'challenge',
        difficulty: 'advanced',
        xpReward: 250,
        unlocked: false,
        completed: false,
        stars: 0
      }
    ]
  },
  {
    id: 'components',
    title: 'Calendar Components',
    description: 'Build events, todos, and more',
    rfcSection: '3.6',
    unlocked: false,
    completionPercentage: 0,
    levels: [
      {
        id: 'components-1',
        chapterId: 'components',
        title: 'VEVENT Basics',
        description: 'Create your first calendar event',
        type: 'tutorial',
        difficulty: 'beginner',
        xpReward: 200,
        unlocked: true,
        completed: false,
        stars: 0
      },
      {
        id: 'components-2',
        chapterId: 'components',
        title: 'Event Properties',
        description: 'Add required and optional event properties',
        type: 'practice',
        difficulty: 'intermediate',
        xpReward: 250,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'components-3',
        chapterId: 'components',
        title: 'VTODO Tasks',
        description: 'Create and manage todo items',
        type: 'practice',
        difficulty: 'intermediate',
        xpReward: 250,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'components-4',
        chapterId: 'components',
        title: 'Time Zones',
        description: 'Work with VTIMEZONE components',
        type: 'challenge',
        difficulty: 'advanced',
        xpReward: 300,
        unlocked: false,
        completed: false,
        stars: 0
      }
    ]
  },
  {
    id: 'recurrence',
    title: 'Recurrence Mastery',
    description: 'Master complex recurring events',
    rfcSection: '3.3.10',
    unlocked: false,
    completionPercentage: 0,
    levels: [
      {
        id: 'recurrence-1',
        chapterId: 'recurrence',
        title: 'Simple Recurrence',
        description: 'Daily and weekly recurring events',
        type: 'tutorial',
        difficulty: 'intermediate',
        xpReward: 250,
        unlocked: true,
        completed: false,
        stars: 0
      },
      {
        id: 'recurrence-2',
        chapterId: 'recurrence',
        title: 'Complex Patterns',
        description: 'Monthly and yearly recurrence with intervals',
        type: 'practice',
        difficulty: 'advanced',
        xpReward: 300,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'recurrence-3',
        chapterId: 'recurrence',
        title: 'Exceptions and Limits',
        description: 'EXDATE, COUNT, and UNTIL',
        type: 'challenge',
        difficulty: 'advanced',
        xpReward: 350,
        unlocked: false,
        completed: false,
        stars: 0
      },
      {
        id: 'recurrence-boss',
        chapterId: 'recurrence',
        title: 'The Ultimate Schedule',
        description: 'Create a complex recurring event system',
        type: 'boss',
        difficulty: 'advanced',
        xpReward: 500,
        unlocked: false,
        completed: false,
        stars: 0
      }
    ]
  }
];

// Initial achievements
export const achievements: Achievement[] = [
  {
    id: 'first-calendar',
    title: 'Calendar Creator',
    description: 'Create your first valid VCALENDAR',
    icon: '📅',
    xpReward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'event-master',
    title: 'Event Master',
    description: 'Create 10 valid VEVENT components',
    icon: '🎯',
    xpReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'time-lord',
    title: 'Time Lord',
    description: 'Handle events in 5 different time zones',
    icon: '🌍',
    xpReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'recurrence-guru',
    title: 'Recurrence Guru',
    description: 'Create 5 complex recurring events',
    icon: '🔄',
    xpReward: 400,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'bug-buster',
    title: 'Bug Buster',
    description: 'Fix 20 invalid calendar files',
    icon: '🐛',
    xpReward: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a challenge in under 60 seconds',
    icon: '⚡',
    xpReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get 3 stars on 10 levels',
    icon: '⭐',
    xpReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'no-hints',
    title: 'Self-Reliant',
    description: 'Complete a chapter without using hints',
    icon: '💪',
    xpReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
];

// Helper functions
export function getChapterProgress(chapter: Chapter): number {
  const completedLevels = chapter.levels.filter(level => level.completed).length;
  return (completedLevels / chapter.levels.length) * 100;
}

export function calculatePlayerLevel(xp: number): { level: number; xpForNext: number; xpProgress: number } {
  const baseXP = 1000;
  const multiplier = 1.5;
  let level = 1;
  let totalRequired = 0;
  
  while (xp >= totalRequired + baseXP * Math.pow(multiplier, level - 1)) {
    totalRequired += baseXP * Math.pow(multiplier, level - 1);
    level++;
  }
  
  const xpForCurrentLevel = baseXP * Math.pow(multiplier, level - 1);
  const xpProgress = xp - totalRequired;
  
  return {
    level,
    xpForNext: xpForCurrentLevel,
    xpProgress
  };
}

export function unlockNextLevel(chapters: Chapter[], completedLevelId: string): Chapter[] {
  const updatedChapters = [...chapters];
  
  // Find the completed level
  for (const chapter of updatedChapters) {
    const levelIndex = chapter.levels.findIndex(l => l.id === completedLevelId);
    if (levelIndex !== -1) {
      // Mark as completed
      chapter.levels[levelIndex].completed = true;
      
      // Unlock next level in chapter
      if (levelIndex + 1 < chapter.levels.length) {
        chapter.levels[levelIndex + 1].unlocked = true;
      }
      
      // Update chapter completion
      chapter.completionPercentage = getChapterProgress(chapter);
      
      // If chapter is complete, unlock next chapter
      if (chapter.completionPercentage === 100) {
        const chapterIndex = updatedChapters.findIndex(c => c.id === chapter.id);
        if (chapterIndex + 1 < updatedChapters.length) {
          updatedChapters[chapterIndex + 1].unlocked = true;
        }
      }
      
      break;
    }
  }
  
  return updatedChapters;
}