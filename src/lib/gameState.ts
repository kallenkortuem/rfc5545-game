// Game State Management using React Context and localStorage

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Chapter, 
  Level, 
  Achievement, 
  PlayerProgress, 
  GameStatistics,
  gameChapters,
  achievements as initialAchievements,
  unlockNextLevel,
  calculatePlayerLevel
} from './gameData';

interface GameState {
  chapters: Chapter[];
  achievements: Achievement[];
  playerProgress: PlayerProgress;
  currentChapterId: string | null;
  currentLevelId: string | null;
  
  // Actions
  completeLevel: (levelId: string, stars: number, xpEarned: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStatistics: (updates: Partial<GameStatistics>) => void;
  selectLevel: (chapterId: string, levelId: string) => void;
  resetProgress: () => void;
  useHint: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

const STORAGE_KEY = 'rfc5545-game-progress';

// Initial player progress
const initialProgress: PlayerProgress = {
  currentLevel: 1,
  totalXP: 0,
  achievements: [],
  completedLevels: [],
  unlockedChapters: ['basics'],
  statistics: {
    totalPlayTime: 0,
    challengesCompleted: 0,
    perfectScores: 0,
    hintsUsed: 0,
    errorsFixed: 0,
    calendarsCreated: 0
  }
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<Chapter[]>(gameChapters);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(initialProgress);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setChapters(parsed.chapters || gameChapters);
        setAchievements(parsed.achievements || initialAchievements);
        setPlayerProgress(parsed.playerProgress || initialProgress);
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    const dataToSave = {
      chapters,
      achievements,
      playerProgress
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [chapters, achievements, playerProgress]);

  const completeLevel = (levelId: string, stars: number, xpEarned: number) => {
    // Update chapters with completed level
    const updatedChapters = unlockNextLevel(chapters, levelId);
    setChapters(updatedChapters);

    // Update player progress
    setPlayerProgress(prev => ({
      ...prev,
      totalXP: prev.totalXP + xpEarned,
      completedLevels: [...new Set([...prev.completedLevels, levelId])],
      statistics: {
        ...prev.statistics,
        challengesCompleted: prev.statistics.challengesCompleted + 1,
        perfectScores: stars === 3 ? prev.statistics.perfectScores + 1 : prev.statistics.perfectScores
      }
    }));

    // Check for achievement progress
    checkAchievements(levelId, stars);
  };

  const checkAchievements = (levelId: string, stars: number) => {
    setAchievements(prev => {
      const updated = [...prev];
      
      // First calendar achievement
      if (levelId === 'basics-2' && !prev.find(a => a.id === 'first-calendar')?.unlocked) {
        const achievementIndex = updated.findIndex(a => a.id === 'first-calendar');
        if (achievementIndex !== -1) {
          updated[achievementIndex] = {
            ...updated[achievementIndex],
            unlocked: true,
            progress: 1
          };
        }
      }

      // Perfectionist achievement
      if (stars === 3) {
        const achievementIndex = updated.findIndex(a => a.id === 'perfectionist');
        if (achievementIndex !== -1 && !updated[achievementIndex].unlocked) {
          updated[achievementIndex] = {
            ...updated[achievementIndex],
            progress: Math.min(updated[achievementIndex].progress + 1, updated[achievementIndex].maxProgress),
            unlocked: updated[achievementIndex].progress + 1 >= updated[achievementIndex].maxProgress
          };
        }
      }

      return updated;
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      const updated = [...prev];
      const index = updated.findIndex(a => a.id === achievementId);
      if (index !== -1 && !updated[index].unlocked) {
        updated[index] = {
          ...updated[index],
          unlocked: true,
          progress: updated[index].maxProgress
        };
        
        // Add XP reward
        setPlayerProgress(p => ({
          ...p,
          totalXP: p.totalXP + updated[index].xpReward,
          achievements: [...p.achievements, achievementId]
        }));
      }
      return updated;
    });
  };

  const updateStatistics = (updates: Partial<GameStatistics>) => {
    setPlayerProgress(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        ...updates
      }
    }));
  };

  const selectLevel = (chapterId: string, levelId: string) => {
    setCurrentChapterId(chapterId);
    setCurrentLevelId(levelId);
  };

  const useHint = () => {
    setPlayerProgress(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        hintsUsed: prev.statistics.hintsUsed + 1
      }
    }));
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setChapters(gameChapters);
      setAchievements(initialAchievements);
      setPlayerProgress(initialProgress);
      setCurrentChapterId(null);
      setCurrentLevelId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value: GameState = {
    chapters,
    achievements,
    playerProgress,
    currentChapterId,
    currentLevelId,
    completeLevel,
    unlockAchievement,
    updateStatistics,
    selectLevel,
    resetProgress,
    useHint
  };

  return React.createElement(GameContext.Provider, { value }, children);
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}

// Helper hooks
export function usePlayerLevel() {
  const { playerProgress } = useGameState();
  return calculatePlayerLevel(playerProgress.totalXP);
}

export function useCurrentLevel() {
  const { chapters, currentChapterId, currentLevelId } = useGameState();
  
  if (!currentChapterId || !currentLevelId) return null;
  
  const chapter = chapters.find(c => c.id === currentChapterId);
  if (!chapter) return null;
  
  return chapter.levels.find(l => l.id === currentLevelId);
}

export function useChapterById(chapterId: string) {
  const { chapters } = useGameState();
  return chapters.find(c => c.id === chapterId);
}

export function useAchievementProgress() {
  const { achievements } = useGameState();
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;
  const percentage = (unlocked / total) * 100;
  
  return { unlocked, total, percentage };
}