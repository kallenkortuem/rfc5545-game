"use client";

import { usePlayerLevel, useGameState } from '@/lib/gameState';

export default function PlayerStats() {
  const { playerProgress } = useGameState();
  const playerLevel = usePlayerLevel();
  
  const xpPercentage = (playerLevel.xpProgress / playerLevel.xpForNext) * 100;

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Level</span>
        <span className="text-2xl font-bold text-yellow-400">{playerLevel.level}</span>
      </div>
      
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">XP Progress</span>
          <span className="text-slate-500">{playerLevel.xpProgress}/{playerLevel.xpForNext}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center">
          <p className="text-slate-500">Total XP</p>
          <p className="font-semibold">{playerProgress.totalXP}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500">Challenges</p>
          <p className="font-semibold">{playerProgress.statistics.challengesCompleted}</p>
        </div>
      </div>
    </div>
  );
}