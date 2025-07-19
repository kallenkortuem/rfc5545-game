"use client";

import { useGameState, useAchievementProgress } from '@/lib/gameState';

export default function AchievementPanel() {
  const { achievements } = useGameState();
  const { unlocked, total, percentage } = useAchievementProgress();
  
  // Show only recent or featured achievements
  const featuredAchievements = achievements.slice(0, 4);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-purple-400">🏆</span> Achievements
        </h3>
        <span className="text-sm text-slate-400">{unlocked}/{total}</span>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {featuredAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg border transition-all
              ${achievement.unlocked 
                ? 'bg-purple-900/20 border-purple-700/50' 
                : 'bg-slate-900/50 border-slate-800 opacity-60'
              }
            `}
          >
            <div className="text-2xl">{achievement.icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${achievement.unlocked ? 'text-purple-300' : 'text-slate-400'}`}>
                {achievement.title}
              </h4>
              <p className="text-xs text-slate-500 truncate">{achievement.description}</p>
              {!achievement.unlocked && achievement.maxProgress > 1 && (
                <div className="mt-1">
                  <div className="w-full bg-slate-800 rounded-full h-1">
                    <div 
                      className="bg-purple-600 h-1 rounded-full transition-all"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {achievement.unlocked && (
              <div className="text-xs text-purple-400 font-medium">
                +{achievement.xpReward} XP
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-slate-400 hover:text-white transition-colors">
        View All Achievements →
      </button>
    </div>
  );
}