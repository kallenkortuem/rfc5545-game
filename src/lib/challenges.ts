// Challenge definitions for each level

import { Challenge, ValidationRule } from './gameData';

// Validation rules
const hasVCalendarRule: ValidationRule = {
  id: 'has-vcalendar',
  description: 'Must have a VCALENDAR component',
  test: (input: string) => input.includes('BEGIN:VCALENDAR') && input.includes('END:VCALENDAR'),
  errorMessage: 'Your calendar must start with BEGIN:VCALENDAR and end with END:VCALENDAR'
};

const hasVersionRule: ValidationRule = {
  id: 'has-version',
  description: 'Must have VERSION:2.0',
  test: (input: string) => /VERSION:2\.0/i.test(input),
  errorMessage: 'Your calendar must include VERSION:2.0'
};

const hasProdIdRule: ValidationRule = {
  id: 'has-prodid',
  description: 'Must have a PRODID property',
  test: (input: string) => /PRODID:/i.test(input),
  errorMessage: 'Your calendar must include a PRODID property'
};

const hasValidEventRule: ValidationRule = {
  id: 'has-valid-event',
  description: 'Must have a valid VEVENT',
  test: (input: string) => {
    const hasBegin = input.includes('BEGIN:VEVENT');
    const hasEnd = input.includes('END:VEVENT');
    const hasUid = /UID:/i.test(input);
    const hasDtstamp = /DTSTAMP:/i.test(input);
    return hasBegin && hasEnd && hasUid && hasDtstamp;
  },
  errorMessage: 'Your event must have BEGIN:VEVENT, END:VEVENT, UID, and DTSTAMP'
};

// Challenge definitions
export const challenges: Record<string, Challenge> = {
  // Basics Chapter
  'basics-1': {
    id: 'basics-1',
    levelId: 'basics-1',
    title: 'Welcome to iCalendar',
    instructions: `Welcome to the world of RFC 5545! 

The iCalendar format is used to represent calendar data. Every iCalendar file starts with BEGIN:VCALENDAR and ends with END:VCALENDAR.

Click "Next" to continue learning about iCalendar.`,
    startingCode: '',
    solution: '',
    hints: [],
    validationRules: []
  },
  
  'basics-2': {
    id: 'basics-2',
    levelId: 'basics-2',
    title: 'Your First Calendar',
    instructions: `Create your first iCalendar file!

Every iCalendar file must:
1. Start with BEGIN:VCALENDAR
2. End with END:VCALENDAR
3. Include VERSION:2.0
4. Include a PRODID (Product Identifier)

The PRODID identifies the software that created the calendar. Use "-//Your Name//Your App//EN" format.`,
    startingCode: ``,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
END:VCALENDAR`,
    hints: [
      'Start with BEGIN:VCALENDAR',
      'Add VERSION:2.0 on the next line',
      'Add PRODID:-//Your Name//Your App//EN',
      'End with END:VCALENDAR'
    ],
    validationRules: [hasVCalendarRule, hasVersionRule, hasProdIdRule]
  },

  'basics-3': {
    id: 'basics-3',
    levelId: 'basics-3',
    title: 'Calendar Properties',
    instructions: `Let's add more properties to your calendar!

Common calendar properties include:
- CALSCALE: Calendar scale (default is GREGORIAN)
- METHOD: Used for iTIP (e.g., REQUEST, REPLY)
- X-WR-CALNAME: Calendar name (non-standard but widely supported)

Add these properties to make your calendar more descriptive.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
CALSCALE:GREGORIAN
X-WR-CALNAME:My Calendar
END:VCALENDAR`,
    hints: [
      'Add CALSCALE:GREGORIAN after PRODID',
      'Add X-WR-CALNAME:My Calendar to give your calendar a name',
      'Properties go between BEGIN:VCALENDAR and END:VCALENDAR'
    ],
    validationRules: [
      hasVCalendarRule, 
      hasVersionRule, 
      hasProdIdRule,
      {
        id: 'has-calscale',
        description: 'Should have CALSCALE property',
        test: (input: string) => /CALSCALE:/i.test(input),
        errorMessage: 'Add CALSCALE:GREGORIAN to your calendar'
      }
    ]
  },

  'basics-boss': {
    id: 'basics-boss',
    levelId: 'basics-boss',
    title: 'Fix the Broken Calendar',
    instructions: `Oh no! This calendar file has several errors. Can you fix them?

Common mistakes include:
- Missing required properties
- Incorrect property values
- Mismatched BEGIN/END tags
- Wrong line endings

Fix all the errors to make this calendar valid according to RFC 5545.`,
    startingCode: `BEGIN:CALENDAR
VESION:2.0
PRODID:-//Broken Software//
BEGIN:VEVENT
SUMMARY:Important Meeting
DTSTART:2024-01-15
END:EVENT
END:CALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Broken Software//Fixed//EN
BEGIN:VEVENT
UID:meeting-001@example.com
DTSTAMP:20240101T120000Z
SUMMARY:Important Meeting
DTSTART:20240115
END:VEVENT
END:VCALENDAR`,
    hints: [
      'CALENDAR should be VCALENDAR',
      'VESION should be VERSION',
      'PRODID needs a proper format',
      'EVENT should be VEVENT',
      'VEVENT requires UID and DTSTAMP properties'
    ],
    validationRules: [hasVCalendarRule, hasVersionRule, hasProdIdRule, hasValidEventRule]
  },

  // Data Types Chapter
  'datatypes-1': {
    id: 'datatypes-1',
    levelId: 'datatypes-1',
    title: 'Text and Binary Types',
    instructions: `Let's learn about TEXT and BINARY data types!

TEXT is the most common type:
- Used for SUMMARY, DESCRIPTION, LOCATION
- Can contain any characters except control characters
- Use backslash to escape special characters: \\n (newline), \\, (comma), \\; (semicolon)

Create an event with TEXT properties.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:event-001@example.com
DTSTAMP:20240101T120000Z
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:event-001@example.com
DTSTAMP:20240101T120000Z
SUMMARY:Team Meeting
DESCRIPTION:Weekly sync\\nAgenda:\\n- Project updates\\n- Q&A
LOCATION:Conference Room\\, Building A
END:VEVENT
END:VCALENDAR`,
    hints: [
      'Add SUMMARY with a simple text value',
      'Add DESCRIPTION with escaped newlines (\\n)',
      'Add LOCATION and escape the comma with \\,'
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: 'has-text-properties',
        description: 'Must have SUMMARY, DESCRIPTION, and LOCATION',
        test: (input: string) => {
          return /SUMMARY:/i.test(input) && 
                 /DESCRIPTION:/i.test(input) && 
                 /LOCATION:/i.test(input);
        },
        errorMessage: 'Add SUMMARY, DESCRIPTION, and LOCATION properties'
      }
    ]
  },

  'datatypes-2': {
    id: 'datatypes-2',
    levelId: 'datatypes-2',
    title: 'Date and Time Types',
    instructions: `Master DATE, DATE-TIME, and TIME types!

DATE format: YYYYMMDD (e.g., 20240115)
DATE-TIME format: YYYYMMDDTHHMMSS (e.g., 20240115T143000)
- Add 'Z' suffix for UTC time: 20240115T143000Z
- Or use TZID parameter for timezone

Create an event with proper date/time values.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:event-002@example.com
DTSTAMP:20240101T120000Z
SUMMARY:Birthday Party
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:event-002@example.com
DTSTAMP:20240101T120000Z
SUMMARY:Birthday Party
DTSTART:20240315T180000
DTEND:20240315T220000
END:VEVENT
END:VCALENDAR`,
    hints: [
      'Add DTSTART with date-time format: YYYYMMDDTHHMMSS',
      'Add DTEND with the same format',
      'For local time, omit the Z suffix'
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: 'has-datetime-properties',
        description: 'Must have valid DTSTART and DTEND',
        test: (input: string) => {
          const dtStartMatch = /DTSTART:(\d{8}T\d{6}Z?)/i.test(input);
          const dtEndMatch = /DTEND:(\d{8}T\d{6}Z?)/i.test(input);
          return dtStartMatch && dtEndMatch;
        },
        errorMessage: 'Add DTSTART and DTEND with proper date-time format (YYYYMMDDTHHMMSS)'
      }
    ]
  },

  // Components Chapter
  'components-1': {
    id: 'components-1',
    levelId: 'components-1',
    title: 'VEVENT Basics',
    instructions: `Time to create your first complete event!

A minimal VEVENT requires:
- UID: Unique identifier
- DTSTAMP: When the event was created
- DTSTART: When the event starts

Recommended properties:
- SUMMARY: Event title
- DESCRIPTION: Detailed description
- LOCATION: Where it takes place

Create a complete event for a team standup meeting.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN

END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:standup-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240115T100000
SUMMARY:Daily Standup
DESCRIPTION:Team sync to discuss progress and blockers
LOCATION:Zoom Meeting Room
END:VEVENT
END:VCALENDAR`,
    hints: [
      'Add BEGIN:VEVENT and END:VEVENT',
      'Include UID, DTSTAMP, and DTSTART',
      'Add SUMMARY, DESCRIPTION, and LOCATION for a complete event'
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: 'has-complete-event',
        description: 'Event must have all recommended properties',
        test: (input: string) => {
          return /DTSTART:/i.test(input) &&
                 /SUMMARY:/i.test(input) &&
                 /DESCRIPTION:/i.test(input) &&
                 /LOCATION:/i.test(input);
        },
        errorMessage: 'Include DTSTART, SUMMARY, DESCRIPTION, and LOCATION'
      }
    ]
  },

  // Recurrence Chapter
  'recurrence-1': {
    id: 'recurrence-1',
    levelId: 'recurrence-1',
    title: 'Simple Recurrence',
    instructions: `Let's create recurring events with RRULE!

RRULE (Recurrence Rule) defines how events repeat:
- FREQ: DAILY, WEEKLY, MONTHLY, YEARLY
- INTERVAL: How often (e.g., 2 = every 2 days/weeks)
- COUNT: Total number of occurrences
- UNTIL: End date

Create a weekly team meeting that occurs every Monday.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:weekly-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240108T140000
SUMMARY:Weekly Team Meeting
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:weekly-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240108T140000
SUMMARY:Weekly Team Meeting
RRULE:FREQ=WEEKLY;BYDAY=MO
END:VEVENT
END:VCALENDAR`,
    hints: [
      'Add RRULE property after SUMMARY',
      'Use FREQ=WEEKLY for weekly recurrence',
      'Add BYDAY=MO to specify Monday'
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: 'has-rrule',
        description: 'Must have valid RRULE',
        test: (input: string) => {
          return /RRULE:FREQ=WEEKLY/i.test(input);
        },
        errorMessage: 'Add RRULE:FREQ=WEEKLY;BYDAY=MO for weekly Monday meetings'
      }
    ]
  }
};

// Helper function to get challenge by level ID
export function getChallengeByLevelId(levelId: string): Challenge | undefined {
  return challenges[levelId];
}