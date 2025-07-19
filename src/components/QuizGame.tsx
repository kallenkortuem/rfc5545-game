'use client';

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the MIME type for iCalendar data?",
    options: ["text/calendar", "application/calendar", "text/icalendar", "application/icalendar"],
    correctAnswer: 0,
    explanation: "The MIME type for iCalendar data is 'text/calendar' as specified in RFC 5545.",
    category: "Basics"
  },
  {
    id: 2,
    question: "Which property is required in every VEVENT component?",
    options: ["SUMMARY", "DTSTART", "DTEND", "DESCRIPTION"],
    correctAnswer: 1,
    explanation: "DTSTART is required in every VEVENT component to specify when the event starts.",
    category: "Events"
  },
  {
    id: 3,
    question: "What does RRULE stand for?",
    options: ["Repeat Rule", "Recurrence Rule", "Recursive Rule", "Regular Rule"],
    correctAnswer: 1,
    explanation: "RRULE stands for Recurrence Rule and defines recurring patterns for calendar components.",
    category: "Recurrence"
  },
  {
    id: 4,
    question: "Which component represents a to-do item in iCalendar?",
    options: ["VEVENT", "VTODO", "VTASK", "VITEM"],
    correctAnswer: 1,
    explanation: "VTODO represents a to-do item or task in the iCalendar specification.",
    category: "Components"
  },
  {
    id: 5,
    question: "What is the purpose of the UID property?",
    options: ["User Identifier", "Unique Identifier", "Universal ID", "Update ID"],
    correctAnswer: 1,
    explanation: "UID provides a globally unique identifier for each calendar component.",
    category: "Properties"
  },
  {
    id: 6,
    question: "Which property defines the time zone for a datetime value?",
    options: ["TIMEZONE", "TZ", "TZID", "ZONE"],
    correctAnswer: 2,
    explanation: "TZID (Time Zone Identifier) specifies the time zone for datetime values.",
    category: "Timezones"
  },
  {
    id: 7,
    question: "What does FREQ=WEEKLY;INTERVAL=2 mean in an RRULE?",
    options: ["Every 2 weeks", "Twice a week", "Every 2 days", "Weekly for 2 weeks"],
    correctAnswer: 0,
    explanation: "FREQ=WEEKLY;INTERVAL=2 means the event repeats every 2 weeks.",
    category: "Recurrence"
  },
  {
    id: 8,
    question: "Which format is used for date-time values in UTC?",
    options: ["YYYYMMDDTHHMMSSZ", "YYYY-MM-DDTHH:MM:SSZ", "YYYYMMDD:HHMMSSZ", "YYYY/MM/DD HH:MM:SSZ"],
    correctAnswer: 0,
    explanation: "UTC date-time values use the format YYYYMMDDTHHMMSSZ, with Z indicating UTC.",
    category: "DateTime"
  }
];

export default function QuizGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Quiz Completed! 🎉
        </h2>
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-xl text-gray-600">
            You got {Math.round((score / questions.length) * 100)}% correct!
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Performance by Category:</h3>
            {['Basics', 'Events', 'Recurrence', 'Components', 'Properties', 'Timezones', 'DateTime'].map(category => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const categoryScore = categoryQuestions.filter(q => 
                answeredQuestions.includes(q.id) && 
                selectedAnswer === q.correctAnswer
              ).length;
              return (
                <div key={category} className="flex justify-between text-sm">
                  <span>{category}:</span>
                  <span>{categoryScore}/{categoryQuestions.length}</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-sm text-gray-600">
          Score: {score}/{answeredQuestions.length}
        </div>
      </div>
      
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
          {currentQuestion.category}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {currentQuestion.question}
      </h2>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left border rounded-lg transition-colors ";
          
          if (selectedAnswer === null) {
            buttonClass += "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
          } else if (index === currentQuestion.correctAnswer) {
            buttonClass += "border-green-500 bg-green-50 text-green-800";
          } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
            buttonClass += "border-red-500 bg-red-50 text-red-800";
          } else {
            buttonClass += "border-gray-300 bg-gray-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={buttonClass}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-blue-700">{currentQuestion.explanation}</p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={handleNextQuestion}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}