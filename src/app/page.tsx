'use client';

import { useState } from 'react';
import QuizGame from '@/components/QuizGame';
import CalendarBuilder from '@/components/CalendarBuilder';
import RecurrenceRuleBuilder from '@/components/RecurrenceRuleBuilder';

export default function Home() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'quiz',
      title: 'RFC 5545 Quiz',
      description: 'Test your knowledge of iCalendar specification',
      component: QuizGame
    },
    {
      id: 'calendar',
      title: 'Calendar Event Builder',
      description: 'Create and validate iCalendar events',
      component: CalendarBuilder
    },
    {
      id: 'recurrence',
      title: 'Recurrence Rule Builder',
      description: 'Learn RRULE patterns and syntax',
      component: RecurrenceRuleBuilder
    }
  ];

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    if (game) {
      const Component = game.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">{game.title}</h1>
              <button
                onClick={() => setActiveGame(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Menu
              </button>
            </div>
            <Component />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            RFC 5545 Learning Game
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master the iCalendar specification through interactive games and challenges.
            Learn about calendar components, properties, and recurrence rules.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {game.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {game.description}
              </p>
              <button
                onClick={() => setActiveGame(game.id)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Game
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About RFC 5545
            </h2>
            <p className="text-gray-600 leading-relaxed">
              RFC 5545 defines the Internet Calendaring and Scheduling Core Object Specification (iCalendar).
              It specifies a standard format for calendar data exchange, including events, todos, journal entries,
              and free/busy information. Understanding RFC 5545 is essential for developers working with calendar
              applications, scheduling systems, and time management tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
