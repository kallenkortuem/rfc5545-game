"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Level, Challenge } from '@/lib/gameData';
import { useGameState } from '@/lib/gameState';

interface TutorialViewProps {
  level: Level;
  challenge: Challenge;
}

export default function TutorialView({ level, challenge }: TutorialViewProps) {
  const router = useRouter();
  const { completeLevel } = useGameState();
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    // Complete the tutorial level
    completeLevel(level.id, 3, level.xpReward);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-semibold">{level.title}</h1>
                <p className="text-sm text-slate-400">Tutorial</p>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {level.xpReward} XP
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">{challenge.title}</h2>
              
              <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                {challenge.instructions}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  Step {currentStep + 1} of 1
                </div>
                
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Complete Tutorial →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-yellow-400">💡</span> Key Takeaways
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▸</span>
                <span>iCalendar is the standard format for calendar data exchange</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▸</span>
                <span>RFC 5545 defines the complete specification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">▸</span>
                <span>Every calendar starts with BEGIN:VCALENDAR and ends with END:VCALENDAR</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}