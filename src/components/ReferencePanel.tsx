"use client";

import { useState } from 'react';

interface ReferenceSection {
  title: string;
  items: { name: string; description: string; example?: string }[];
}

const referenceData: ReferenceSection[] = [
  {
    title: "Core Components",
    items: [
      {
        name: "VCALENDAR",
        description: "Root component that contains all other components",
        example: "BEGIN:VCALENDAR\n...\nEND:VCALENDAR"
      },
      {
        name: "VEVENT",
        description: "Represents a calendar event",
        example: "BEGIN:VEVENT\nUID:event@example.com\nDTSTAMP:20240101T120000Z\nEND:VEVENT"
      },
      {
        name: "VTODO",
        description: "Represents a to-do task",
        example: "BEGIN:VTODO\nUID:todo@example.com\nEND:VTODO"
      },
      {
        name: "VJOURNAL",
        description: "Represents a journal entry",
        example: "BEGIN:VJOURNAL\nUID:journal@example.com\nEND:VJOURNAL"
      }
    ]
  },
  {
    title: "Required Properties",
    items: [
      {
        name: "VERSION",
        description: "iCalendar version (must be 2.0)",
        example: "VERSION:2.0"
      },
      {
        name: "PRODID",
        description: "Product identifier",
        example: "PRODID:-//Company//Product//EN"
      },
      {
        name: "UID",
        description: "Unique identifier for components",
        example: "UID:unique-id@example.com"
      },
      {
        name: "DTSTAMP",
        description: "Creation timestamp",
        example: "DTSTAMP:20240101T120000Z"
      }
    ]
  },
  {
    title: "Date/Time Formats",
    items: [
      {
        name: "DATE",
        description: "Calendar date",
        example: "20240115 (YYYYMMDD)"
      },
      {
        name: "DATE-TIME",
        description: "Date and time",
        example: "20240115T143000 (YYYYMMDDTHHMMSS)"
      },
      {
        name: "UTC Time",
        description: "Date-time in UTC",
        example: "20240115T143000Z (Z suffix)"
      },
      {
        name: "DURATION",
        description: "Time duration",
        example: "PT1H30M (1 hour 30 minutes)"
      }
    ]
  },
  {
    title: "Recurrence Rules",
    items: [
      {
        name: "FREQ",
        description: "Frequency type",
        example: "FREQ=DAILY|WEEKLY|MONTHLY|YEARLY"
      },
      {
        name: "INTERVAL",
        description: "Interval between occurrences",
        example: "INTERVAL=2 (every 2 days/weeks/etc)"
      },
      {
        name: "BYDAY",
        description: "Days of the week",
        example: "BYDAY=MO,WE,FR"
      },
      {
        name: "COUNT/UNTIL",
        description: "Limit occurrences",
        example: "COUNT=10 or UNTIL=20240131"
      }
    ]
  }
];

export default function ReferencePanel() {
  const [expandedSection, setExpandedSection] = useState<string | null>("Core Components");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = referenceData.map(section => ({
    ...section,
    items: section.items.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 transform transition-transform z-40 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold mb-3">RFC 5545 Quick Reference</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
              className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <span className="font-medium">{section.title}</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  expandedSection === section.title ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSection === section.title && (
              <div className="mt-2 space-y-2">
                {section.items.map((item) => (
                  <div key={item.name} className="p-3 bg-slate-800/50 rounded">
                    <h4 className="font-mono text-sm text-blue-400 mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                    {item.example && (
                      <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
                        <code className="text-green-400">{item.example}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        <p>Based on RFC 5545 specification</p>
        <a
          href="https://datatracker.ietf.org/doc/html/rfc5545"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          View full specification →
        </a>
      </div>
    </div>
  );
}