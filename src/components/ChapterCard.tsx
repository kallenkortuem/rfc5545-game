"use client";

import { Chapter } from '@/lib/gameData';
import { useGameState } from '@/lib/gameState';
import { useRouter } from 'next/navigation';

interface ChapterCardProps {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const { selectLevel } = useGameState();
  const router = useRouter();
  
  const completedLevels = chapter.levels.filter(l => l.completed).length;
  const totalLevels = chapter.levels.length;
  const progressPercentage = (completedLevels / totalLevels) * 100;

  const handleLevelSelect = (levelId: string) => {
    selectLevel(chapter.id, levelId);
    router.push(`/play/${chapter.id}/${levelId}`);
  };

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${chapter.unlocked ? 'border-slate-700' : 'border-slate-800'} p-6 transition-all ${chapter.unlocked ? 'hover:border-blue-600/50' : 'opacity-50'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{chapter.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{chapter.description}</p>
          <p className="text-xs text-slate-500 mt-1">RFC Section {chapter.rfcSection}</p>
        </div>
        {chapter.unlocked && (
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-400">{completedLevels}/{totalLevels}</p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        )}
      </div>

      {chapter.unlocked && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-400">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {chapter.levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                disabled={!level.unlocked}
                className={`
                  relative p-3 rounded text-sm font-medium transition-all
                  ${level.unlocked 
                    ? level.completed 
                      ? 'bg-green-900/30 border border-green-700/50 text-green-400 hover:bg-green-900/50' 
                      : 'bg-slate-700/50 border border-slate-600 text-white hover:bg-slate-700'
                    : 'bg-slate-800/50 border border-slate-800 text-slate-600 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{level.title}</span>
                  {level.completed && (
                    <div className="flex gap-0.5 ml-2">
                      {[...Array(3)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < level.stars ? 'text-yellow-400' : 'text-slate-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${level.type === 'boss' ? 'text-red-400' : 'text-slate-500'}`}>
                    {level.type.charAt(0).toUpperCase() + level.type.slice(1)}
                  </span>
                  <span className="text-xs text-slate-500">{level.xpReward} XP</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {!chapter.unlocked && (
        <div className="text-center py-4">
          <p className="text-slate-500">🔒 Complete previous chapters to unlock</p>
        </div>
      )}
    </div>
  );
}