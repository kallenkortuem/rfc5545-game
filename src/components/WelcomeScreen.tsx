"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '@/lib/gameState';

export default function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const { playerProgress } = useGameState();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to RFC 5545: The iCalendar Chronicles",
      content: "Embark on an epic journey to master the RFC 5545 specification through interactive challenges and puzzles!",
      icon: "🎮"
    },
    {
      title: "Learn by Doing",
      content: "Write real iCalendar code, get instant feedback, and progress through increasingly complex challenges.",
      icon: "💻"
    },
    {
      title: "Track Your Progress",
      content: "Earn XP, unlock achievements, and compete for the best scores. Can you achieve 3 stars on every level?",
      icon: "⭐"
    },
    {
      title: "Master the Specification",
      content: "From basic calendar structure to complex recurrence rules, you'll become an iCalendar expert!",
      icon: "📚"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleStart = () => {
    onComplete();
    // Navigate to first level
    router.push('/play/basics/basics-1');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full p-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{slides[currentSlide].icon}</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-slate-300">
            {slides[currentSlide].content}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-blue-500' 
                  : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Previous
          </button>

          {currentSlide < slides.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded font-medium transition-all transform hover:scale-105"
            >
              Start Learning!
            </button>
          )}
        </div>

        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}