"use client";

import { useState, useEffect } from 'react';
import { useGameState, usePlayerLevel } from '@/lib/gameState';
import ChapterCard from './ChapterCard';
import PlayerStats from './PlayerStats';
import AchievementPanel from './AchievementPanel';
import WelcomeScreen from './WelcomeScreen';

export default function GameDashboard() {
  const { chapters, playerProgress } = useGameState();
  const playerLevel = usePlayerLevel();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome screen for new players
    const hasSeenWelcome = localStorage.getItem('rfc5545-welcome-seen');
    if (!hasSeenWelcome && playerProgress.totalXP === 0) {
      setShowWelcome(true);
    }
  }, [playerProgress.totalXP]);

  const handleWelcomeComplete = () => {
    localStorage.setItem('rfc5545-welcome-seen', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                RFC 5545: The iCalendar Chronicles
              </h1>
              <p className="text-slate-400 mt-1">Master the art of calendar specification</p>
            </div>
            <PlayerStats />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-blue-400">📚</span> Chapters
            </h2>
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <AchievementPanel />
            
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">💡</span> Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>Complete tutorials before attempting challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>Use hints wisely - they affect your score!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>Three stars require perfect, hint-free completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▸</span>
                  <span>Practice makes perfect - replay levels anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}