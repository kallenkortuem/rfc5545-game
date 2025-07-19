'use client';

import { useState } from 'react';

interface CalendarEvent {
  summary: string;
  dtstart: string;
  dtend: string;
  description: string;
  location: string;
  uid: string;
}

export default function CalendarBuilder() {
  const [event, setEvent] = useState<CalendarEvent>({
    summary: '',
    dtstart: '',
    dtend: '',
    description: '',
    location: '',
    uid: ''
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generatedIcal, setGeneratedIcal] = useState<string>('');

  const generateUID = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}@rfc5545-game`;
  };

  const formatDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const validateEvent = (): boolean => {
    const errors: string[] = [];
    
    if (!event.summary.trim()) {
      errors.push('SUMMARY is required');
    }
    
    if (!event.dtstart) {
      errors.push('DTSTART is required');
    }
    
    if (!event.dtend) {
      errors.push('DTEND is required');
    }
    
    if (event.dtstart && event.dtend) {
      const start = new Date(event.dtstart);
      const end = new Date(event.dtend);
      if (start >= end) {
        errors.push('DTEND must be after DTSTART');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateICalendar = () => {
    if (!validateEvent()) return;

    const uid = event.uid || generateUID();
    const dtstart = formatDateTime(event.dtstart);
    const dtend = formatDateTime(event.dtend);
    const now = formatDateTime(new Date().toISOString());

    const icalLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RFC5545-Game//RFC5545-Game//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `DTSTAMP:${now}`,
      `SUMMARY:${event.summary}`,
    ];

    if (event.description.trim()) {
      icalLines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
    }

    if (event.location.trim()) {
      icalLines.push(`LOCATION:${event.location}`);
    }

    icalLines.push(
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    );

    const icalContent = icalLines.join('\r\n');
    setGeneratedIcal(icalContent);
    
    // Update the event with the generated UID if it was empty
    if (!event.uid) {
      setEvent({ ...event, uid });
    }
  };

  const downloadICalendar = () => {
    if (!generatedIcal) return;
    
    const blob = new Blob([generatedIcal], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.summary || 'event'}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    const exampleEvent: CalendarEvent = {
      summary: 'Weekly Team Meeting',
      dtstart: '2024-07-22T10:00',
      dtend: '2024-07-22T11:00',
      description: 'Weekly sync meeting to discuss project progress and upcoming tasks.',
      location: 'Conference Room A',
      uid: generateUID()
    };
    setEvent(exampleEvent);
    setGeneratedIcal('');
    setValidationErrors([]);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Builder</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary (Required) *
            </label>
            <input
              type="text"
              value={event.summary}
              onChange={(e) => setEvent({ ...event, summary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date & Time (Required) *
            </label>
            <input
              type="datetime-local"
              value={event.dtstart}
              onChange={(e) => setEvent({ ...event, dtstart: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date & Time (Required) *
            </label>
            <input
              type="datetime-local"
              value={event.dtend}
              onChange={(e) => setEvent({ ...event, dtend: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Event description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UID (auto-generated if empty)
            </label>
            <input
              type="text"
              value={event.uid}
              onChange={(e) => setEvent({ ...event, uid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="Unique identifier"
            />
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Validation Errors:</h3>
              <ul className="list-disc list-inside text-red-700 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={generateICalendar}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate iCalendar
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Load Example
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated iCalendar</h2>
        
        {generatedIcal ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                {generatedIcal}
              </pre>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={downloadICalendar}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download .ics file
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(generatedIcal)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Understanding the Output:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>VCALENDAR:</strong> Root container for calendar data</li>
                <li><strong>VEVENT:</strong> Represents a calendar event</li>
                <li><strong>UID:</strong> Globally unique identifier for the event</li>
                <li><strong>DTSTART/DTEND:</strong> Start and end times in UTC format</li>
                <li><strong>DTSTAMP:</strong> When the iCalendar object was created</li>
                <li><strong>SUMMARY:</strong> Brief description/title of the event</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Fill out the event details and click &quot;Generate iCalendar&quot; to see the RFC 5545 formatted output.
          </div>
        )}
      </div>
    </div>
  );
}