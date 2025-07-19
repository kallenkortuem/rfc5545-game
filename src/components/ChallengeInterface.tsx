"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Level, Challenge } from '@/lib/gameData';
import { useGameState } from '@/lib/gameState';
import { parseICalendar } from '@/lib/icalParser';
import CodeEditor from './CodeEditor';
import ValidationPanel from './ValidationPanel';
import HintPanel from './HintPanel';

interface ChallengeInterfaceProps {
  level: Level;
  challenge: Challenge;
}

export default function ChallengeInterface({ level, challenge }: ChallengeInterfaceProps) {
  const router = useRouter();
  const { completeLevel, useHint: recordHint, updateStatistics } = useGameState();
  
  const [code, setCode] = useState(challenge.startingCode);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeStarted] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Validate code whenever it changes
  useEffect(() => {
    if (code.trim()) {
      validateCode();
    } else {
      setValidationResults(null);
    }
  }, [code]);

  const validateCode = () => {
    // First, parse with the RFC 5545 parser
    const parseResult = parseICalendar(code);
    
    // Then check challenge-specific rules
    const ruleResults = challenge.validationRules.map(rule => ({
      ...rule,
      passed: rule.test(code)
    }));

    const allRulesPassed = ruleResults.every(r => r.passed);
    const isValid = parseResult.valid && allRulesPassed;

    setValidationResults({
      parseResult,
      ruleResults,
      isValid
    });

    // Check if challenge is complete
    if (isValid && !isComplete) {
      handleChallengeComplete();
    }
  };

  const handleChallengeComplete = () => {
    setIsComplete(true);
    
    // Calculate stars based on performance
    const timeElapsed = (Date.now() - timeStarted) / 1000; // seconds
    const stars = calculateStars(timeElapsed, hintsUsed);
    
    // Update statistics
    updateStatistics({
      calendarsCreated: 1,
      challengesCompleted: 1
    });

    // Complete the level
    setTimeout(() => {
      completeLevel(level.id, stars, level.xpReward);
    }, 1500);
  };

  const calculateStars = (timeSeconds: number, hints: number): number => {
    if (hints === 0 && timeSeconds < 60) return 3;
    if (hints <= 1 && timeSeconds < 120) return 2;
    return 1;
  };

  const handleShowHint = () => {
    if (!showHints) {
      setShowHints(true);
      setHintsUsed(1);
      recordHint();
    }
  };

  const handleNextHint = () => {
    if (hintsUsed < challenge.hints.length) {
      setHintsUsed(hintsUsed + 1);
      recordHint();
    }
  };

  const handleShowSolution = () => {
    setCode(challenge.solution);
    setHintsUsed(challenge.hints.length);
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
                <p className="text-sm text-slate-400 capitalize">{level.type} • {level.difficulty}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                {level.xpReward} XP
              </div>
              {validationResults?.isValid && (
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm animate-pulse">
                  ✓ Challenge Complete!
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instructions Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4">{challenge.title}</h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-slate-300">
                  {challenge.instructions}
                </div>
              </div>
            </div>

            {/* Hints Panel */}
            <HintPanel
              hints={challenge.hints}
              showHints={showHints}
              hintsUsed={hintsUsed}
              onShowHint={handleShowHint}
              onNextHint={handleNextHint}
              onShowSolution={handleShowSolution}
            />
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            <CodeEditor
              value={code}
              onChange={setCode}
              language="icalendar"
              theme="dark"
            />

            {/* Validation Results */}
            {validationResults && (
              <ValidationPanel
                parseResult={validationResults.parseResult}
                ruleResults={validationResults.ruleResults}
                isComplete={isComplete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}