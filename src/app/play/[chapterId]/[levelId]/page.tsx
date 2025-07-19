"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGameState, useCurrentLevel } from '@/lib/gameState';
import { getChallengeByLevelId } from '@/lib/challenges';
import ChallengeInterface from '@/components/ChallengeInterface';
import TutorialView from '@/components/TutorialView';

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const { selectLevel } = useGameState();
  const currentLevel = useCurrentLevel();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (params.chapterId && params.levelId) {
      selectLevel(params.chapterId as string, params.levelId as string);
      const levelChallenge = getChallengeByLevelId(params.levelId as string);
      setChallenge(levelChallenge);
    }
  }, [params.chapterId, params.levelId, selectLevel]);

  if (!currentLevel || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Loading challenge...</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // For tutorial levels, show a different interface
  if (currentLevel.type === 'tutorial' && challenge.validationRules.length === 0) {
    return <TutorialView level={currentLevel} challenge={challenge} />;
  }

  return <ChallengeInterface level={currentLevel} challenge={challenge} />;
}