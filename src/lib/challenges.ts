// Challenge definitions for each level

import { Challenge, ValidationRule } from "./gameData";

// Validation rules
const hasVCalendarRule: ValidationRule = {
  id: "has-vcalendar",
  description: "Must have a VCALENDAR component",
  test: (input: string) =>
    input.includes("BEGIN:VCALENDAR") && input.includes("END:VCALENDAR"),
  errorMessage:
    "Your calendar must start with BEGIN:VCALENDAR and end with END:VCALENDAR",
};

const hasVersionRule: ValidationRule = {
  id: "has-version",
  description: "Must have VERSION:2.0",
  test: (input: string) => /VERSION:2\.0/i.test(input),
  errorMessage: "Your calendar must include VERSION:2.0",
};

const hasProdIdRule: ValidationRule = {
  id: "has-prodid",
  description: "Must have a PRODID property",
  test: (input: string) => /PRODID:/i.test(input),
  errorMessage: "Your calendar must include a PRODID property",
};

const hasValidEventRule: ValidationRule = {
  id: "has-valid-event",
  description: "Must have a valid VEVENT",
  test: (input: string) => {
    const hasBegin = input.includes("BEGIN:VEVENT");
    const hasEnd = input.includes("END:VEVENT");
    const hasUid = /UID:/i.test(input);
    const hasDtstamp = /DTSTAMP:/i.test(input);
    return hasBegin && hasEnd && hasUid && hasDtstamp;
  },
  errorMessage:
    "Your event must have BEGIN:VEVENT, END:VEVENT, UID, and DTSTAMP",
};

// Challenge definitions
export const challenges: Record<string, Challenge> = {
  // Basics Chapter
  "basics-1": {
    id: "basics-1",
    levelId: "basics-1",
    title: "Welcome to iCalendar",
    instructions: `Welcome to the world of RFC 5545! 

The iCalendar format is used to represent calendar data. Every iCalendar file starts with BEGIN:VCALENDAR and ends with END:VCALENDAR.

Click "Next" to continue learning about iCalendar.`,
    startingCode: "",
    solution: "",
    hints: [],
    validationRules: [],
  },

  "basics-2": {
    id: "basics-2",
    levelId: "basics-2",
    title: "Your First Calendar",
    instructions: `## 🎯 Create your first iCalendar file!

Every iCalendar file **must** include:

### Required Structure
1. **\`BEGIN:VCALENDAR\`** - Opens the calendar container
2. **\`END:VCALENDAR\`** - Closes the calendar container
3. **\`VERSION:2.0\`** - Specifies iCalendar version
4. **\`PRODID\`** - Product Identifier

### 💡 About PRODID
The PRODID identifies the software that created the calendar. It follows this format:

    -//Company//Product//Language

**Example:** \`-//My Company//My Calendar App//EN\``,
    startingCode: ``,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
END:VCALENDAR`,
    hints: [
      "Start with BEGIN:VCALENDAR",
      "Add VERSION:2.0 on the next line",
      "Add PRODID:-//Your Name//Your App//EN",
      "End with END:VCALENDAR",
    ],
    validationRules: [hasVCalendarRule, hasVersionRule, hasProdIdRule],
  },

  "basics-3": {
    id: "basics-3",
    levelId: "basics-3",
    title: "Calendar Properties",
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
      "Add CALSCALE:GREGORIAN after PRODID",
      "Add X-WR-CALNAME:My Calendar to give your calendar a name",
      "Properties go between BEGIN:VCALENDAR and END:VCALENDAR",
    ],
    validationRules: [
      hasVCalendarRule,
      hasVersionRule,
      hasProdIdRule,
      {
        id: "has-calscale",
        description: "Should have CALSCALE property",
        test: (input: string) => /CALSCALE:/i.test(input),
        errorMessage: "Add CALSCALE:GREGORIAN to your calendar",
      },
    ],
  },

  "basics-boss": {
    id: "basics-boss",
    levelId: "basics-boss",
    title: "Fix the Broken Calendar",
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
      "CALENDAR should be VCALENDAR",
      "VESION should be VERSION",
      "PRODID needs a proper format",
      "EVENT should be VEVENT",
      "VEVENT requires UID and DTSTAMP properties",
    ],
    validationRules: [
      hasVCalendarRule,
      hasVersionRule,
      hasProdIdRule,
      hasValidEventRule,
    ],
  },

  // Data Types Chapter
  "datatypes-1": {
    id: "datatypes-1",
    levelId: "datatypes-1",
    title: "Text and Binary Types",
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
      "Add SUMMARY with a simple text value",
      "Add DESCRIPTION with escaped newlines (\\n)",
      "Add LOCATION and escape the comma with \\,",
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-text-properties",
        description: "Must have SUMMARY, DESCRIPTION, and LOCATION",
        test: (input: string) => {
          return (
            /SUMMARY:/i.test(input) &&
            /DESCRIPTION:/i.test(input) &&
            /LOCATION:/i.test(input)
          );
        },
        errorMessage: "Add SUMMARY, DESCRIPTION, and LOCATION properties",
      },
    ],
  },

  "datatypes-2": {
    id: "datatypes-2",
    levelId: "datatypes-2",
    title: "Date and Time Types",
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
      "Add DTSTART with date-time format: YYYYMMDDTHHMMSS",
      "Add DTEND with the same format",
      "For local time, omit the Z suffix",
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-datetime-properties",
        description: "Must have valid DTSTART and DTEND",
        test: (input: string) => {
          const dtStartMatch = /DTSTART:(\d{8}T\d{6}Z?)/i.test(input);
          const dtEndMatch = /DTEND:(\d{8}T\d{6}Z?)/i.test(input);
          return dtStartMatch && dtEndMatch;
        },
        errorMessage:
          "Add DTSTART and DTEND with proper date-time format (YYYYMMDDTHHMMSS)",
      },
    ],
  },

  "datatypes-3": {
    id: "datatypes-3",
    levelId: "datatypes-3",
    title: "Duration and Period",
    instructions: `Learn about DURATION and PERIOD data types!

DURATION represents a length of time:
- Format: P[n]D[T[n]H[n]M[n]S]
- P1D = 1 day
- PT1H30M = 1 hour 30 minutes
- PT30M = 30 minutes

PERIOD represents a time interval:
- Start time / End time: 20240101T100000Z/20240101T110000Z
- Start time / Duration: 20240101T100000Z/PT1H

Create an event with a DURATION property instead of DTEND.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:duration-event-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240115T100000Z
SUMMARY:Team Meeting
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:duration-event-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240115T100000Z
DURATION:PT1H
SUMMARY:Team Meeting
END:VEVENT
END:VCALENDAR`,
    hints: [
      "Replace DTEND with DURATION",
      "Use DURATION:PT1H for a 1-hour event",
      "Duration format starts with P, then T for time portion",
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-duration",
        description: "Must use DURATION instead of DTEND",
        test: (input: string) => {
          const hasDuration = /DURATION:PT?\d+[DHMS]/i.test(input);
          const hasNoDtend = !/DTEND:/i.test(input);
          return hasDuration && hasNoDtend;
        },
        errorMessage:
          "Use DURATION property instead of DTEND (format: PT1H, PT30M, P1D, etc.)",
      },
    ],
  },

  "datatypes-4": {
    id: "datatypes-4",
    levelId: "datatypes-4",
    title: "Recurrence Rules",
    instructions: `Introduction to RECUR data type for repeating events!

The RRULE property defines a recurrence pattern:
- FREQ: Frequency (DAILY, WEEKLY, MONTHLY, YEARLY)
- COUNT: Number of occurrences
- UNTIL: End date
- INTERVAL: Interval between occurrences
- BYDAY: Days of week (MO, TU, WE, TH, FR, SA, SU)

Examples:
- RRULE:FREQ=WEEKLY (every week)
- RRULE:FREQ=DAILY;COUNT=5 (5 times daily)
- RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR (Mon, Wed, Fri)

Create a weekly meeting that occurs every Monday for 4 weeks.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:weekly-meeting-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240108T100000Z
DTEND:20240108T110000Z
SUMMARY:Weekly Team Meeting
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:weekly-meeting-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240108T100000Z
DTEND:20240108T110000Z
RRULE:FREQ=WEEKLY;COUNT=4;BYDAY=MO
SUMMARY:Weekly Team Meeting
END:VEVENT
END:VCALENDAR`,
    hints: [
      "Add an RRULE property to make the event recurring",
      "Use FREQ=WEEKLY for weekly recurrence",
      "Add COUNT=4 to limit to 4 occurrences",
      "Use BYDAY=MO to specify Mondays only"
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-recurrence-rule",
        description: "Must have a valid RRULE",
        test: (input: string) => {
          const hasRRule = /RRULE:/i.test(input);
          const hasFreq = /FREQ=WEEKLY/i.test(input);
          const hasCount = /COUNT=4/i.test(input);
          const hasByDay = /BYDAY=MO/i.test(input);
          return hasRRule && hasFreq && hasCount && hasByDay;
        },
        errorMessage: "Add RRULE with FREQ=WEEKLY, COUNT=4, and BYDAY=MO"
      }
    ]
  },

  // Components Chapter
  "components-1": {
    id: "components-1",
    levelId: "components-1",
    title: "VEVENT Basics",
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
      "Add BEGIN:VEVENT and END:VEVENT",
      "Include UID, DTSTAMP, and DTSTART",
      "Add SUMMARY, DESCRIPTION, and LOCATION for a complete event",
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-complete-event",
        description: "Event must have all recommended properties",
        test: (input: string) => {
          return (
            /DTSTART:/i.test(input) &&
            /SUMMARY:/i.test(input) &&
            /DESCRIPTION:/i.test(input) &&
            /LOCATION:/i.test(input)
          );
        },
        errorMessage: "Include DTSTART, SUMMARY, DESCRIPTION, and LOCATION",
      },
    ],
  },

  "components-2": {
    id: "components-2",
    levelId: "components-2",
    title: "Event Properties",
    instructions: `Let's add more properties to make events more useful!

Important event properties:
- DTEND: When the event ends
- STATUS: TENTATIVE, CONFIRMED, or CANCELLED
- PRIORITY: 0 (undefined) to 9 (highest)
- CATEGORIES: Event categories (comma-separated)
- ORGANIZER: Event organizer email
- ATTENDEE: Event attendees

Create an event with multiple properties for a project kickoff meeting.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:kickoff-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240120T140000
SUMMARY:Project Kickoff Meeting
END:VEVENT
END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VEVENT
UID:kickoff-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240120T140000
DTEND:20240120T160000
SUMMARY:Project Kickoff Meeting
STATUS:CONFIRMED
PRIORITY:1
CATEGORIES:PROJECT,MEETING
ORGANIZER:mailto:manager@example.com
ATTENDEE:mailto:developer1@example.com
ATTENDEE:mailto:developer2@example.com
END:VEVENT
END:VCALENDAR`,
    hints: [
      "Add DTEND two hours after DTSTART",
      "Set STATUS:CONFIRMED",
      "Add PRIORITY:1 for high priority",
      "Use CATEGORIES:PROJECT,MEETING",
      "Add ORGANIZER and ATTENDEE with mailto: prefix"
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-extended-properties",
        description: "Must have DTEND, STATUS, PRIORITY, CATEGORIES, ORGANIZER",
        test: (input: string) => {
          return (
            /DTEND:/i.test(input) &&
            /STATUS:/i.test(input) &&
            /PRIORITY:/i.test(input) &&
            /CATEGORIES:/i.test(input) &&
            /ORGANIZER:/i.test(input)
          );
        },
        errorMessage: "Add DTEND, STATUS, PRIORITY, CATEGORIES, and ORGANIZER properties"
      }
    ]
  },

  "components-3": {
    id: "components-3",
    levelId: "components-3",
    title: "VTODO Tasks",
    instructions: `Learn to create TODO items in iCalendar!

VTODO represents tasks or action items:
- Similar structure to VEVENT
- DUE instead of DTEND
- PERCENT-COMPLETE: 0-100
- STATUS: NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED
- PRIORITY: Task priority

Create a TODO item for completing a code review.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN

END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VTODO
UID:todo-review-001@example.com
DTSTAMP:20240101T120000Z
DTSTART:20240115T090000
DUE:20240117T170000
SUMMARY:Code Review for Feature X
DESCRIPTION:Review pull request #123 for the new feature
STATUS:NEEDS-ACTION
PRIORITY:2
PERCENT-COMPLETE:0
END:VTODO
END:VCALENDAR`,
    hints: [
      "Use BEGIN:VTODO and END:VTODO",
      "Include UID and DTSTAMP like VEVENT",
      "Use DUE instead of DTEND for deadline",
      "Add STATUS:NEEDS-ACTION",
      "Set PERCENT-COMPLETE:0 for not started"
    ],
    validationRules: [
      hasVCalendarRule,
      {
        id: "has-valid-todo",
        description: "Must have a valid VTODO",
        test: (input: string) => {
          const hasBegin = input.includes("BEGIN:VTODO");
          const hasEnd = input.includes("END:VTODO");
          const hasUid = /UID:/i.test(input);
          const hasDtstamp = /DTSTAMP:/i.test(input);
          const hasDue = /DUE:/i.test(input);
          return hasBegin && hasEnd && hasUid && hasDtstamp && hasDue;
        },
        errorMessage: "Your TODO must have BEGIN:VTODO, END:VTODO, UID, DTSTAMP, and DUE"
      },
      {
        id: "has-todo-properties",
        description: "Must have STATUS and PERCENT-COMPLETE",
        test: (input: string) => {
          return /STATUS:/i.test(input) && /PERCENT-COMPLETE:/i.test(input);
        },
        errorMessage: "Add STATUS and PERCENT-COMPLETE properties"
      }
    ]
  },

  "components-4": {
    id: "components-4",
    levelId: "components-4",
    title: "Time Zones",
    instructions: `Master time zones with VTIMEZONE!

VTIMEZONE defines time zone information:
- TZID: Time zone identifier
- STANDARD: Standard time definition
- DAYLIGHT: Daylight saving time definition
- DTSTART: When the definition starts
- TZOFFSETFROM/TZOFFSETTO: UTC offsets
- RRULE: When to change between standard/daylight

Create an event with a custom time zone.`,
    startingCode: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN

END:VCALENDAR`,
    solution: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Company//My App//EN
BEGIN:VTIMEZONE
TZID:America/New_York
BEGIN:STANDARD
DTSTART:20231105T020000
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:20240310T020000
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
UID:tz-event-001@example.com
DTSTAMP:20240101T120000Z
DTSTART;TZID=America/New_York:20240315T100000
DTEND;TZID=America/New_York:20240315T110000
SUMMARY:Meeting in New York Time
END:VEVENT
END:VCALENDAR`,
    hints: [
      "Create a VTIMEZONE component first",
      "Add TZID:America/New_York",
      "Include both STANDARD and DAYLIGHT sub-components",
      "Use TZID parameter in DTSTART and DTEND",
      "TZOFFSETFROM and TZOFFSETTO show UTC offset changes"
    ],
    validationRules: [
      hasVCalendarRule,
      {
        id: "has-timezone",
        description: "Must have VTIMEZONE component",
        test: (input: string) => {
          return input.includes("BEGIN:VTIMEZONE") && 
                 input.includes("END:VTIMEZONE") &&
                 /TZID:/i.test(input);
        },
        errorMessage: "Add a VTIMEZONE component with TZID"
      },
      {
        id: "has-timezone-usage",
        description: "Must use TZID parameter in event",
        test: (input: string) => {
          return /DTSTART;TZID=/i.test(input);
        },
        errorMessage: "Use TZID parameter in DTSTART (e.g., DTSTART;TZID=America/New_York:20240315T100000)"
      }
    ]
  },

  // Recurrence Chapter
  "recurrence-1": {
    id: "recurrence-1",
    levelId: "recurrence-1",
    title: "Simple Recurrence",
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
      "Add RRULE property after SUMMARY",
      "Use FREQ=WEEKLY for weekly recurrence",
      "Add BYDAY=MO to specify Monday",
    ],
    validationRules: [
      hasVCalendarRule,
      hasValidEventRule,
      {
        id: "has-rrule",
        description: "Must have valid RRULE",
        test: (input: string) => {
          return /RRULE:FREQ=WEEKLY/i.test(input);
        },
        errorMessage:
          "Add RRULE:FREQ=WEEKLY;BYDAY=MO for weekly Monday meetings",
      },
    ],
  },
};

// Helper function to get challenge by level ID
export function getChallengeByLevelId(levelId: string): Challenge | undefined {
  return challenges[levelId];
}
