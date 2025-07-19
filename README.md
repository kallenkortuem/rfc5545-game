# RFC 5545 Learning Game

A Next.js web application that helps you learn the RFC 5545 (iCalendar) specification through interactive games and tools.

![RFC 5545 Learning Game Homepage](https://github.com/user-attachments/assets/720cff96-c916-4bbc-a70d-919b81ba7bd3)

## Features

### 🧠 RFC 5545 Quiz
Test your knowledge of the iCalendar specification with an interactive quiz covering:
- MIME types and basic concepts
- Event components (VEVENT)
- Recurrence rules (RRULE)
- Calendar components and properties
- Time zones and date-time formats

![RFC 5545 Quiz](https://github.com/user-attachments/assets/fb69aa8c-e137-4a98-9fb2-3d58790ad23e)

### 📅 Calendar Event Builder
Create and validate iCalendar events with a visual form builder:
- Input event details (summary, dates, description, location)
- Generate RFC 5545 compliant iCalendar (.ics) files
- Download or copy generated iCalendar data
- Learn about VCALENDAR, VEVENT, and property structures

![Calendar Event Builder](https://github.com/user-attachments/assets/2702196a-ecee-4625-9d20-c20af24d2435)

### 🔄 Recurrence Rule Builder
Build and understand RRULE patterns interactively:
- Visual interface for creating recurrence rules
- Quick presets for common patterns (daily, weekdays, bi-weekly, etc.)
- Real-time RRULE generation and validation
- Example occurrence dates
- Learn FREQ, INTERVAL, BYDAY, COUNT, and UNTIL parameters

![Recurrence Rule Builder](https://github.com/user-attachments/assets/4cbab2e2-7862-4897-9778-bc7e03b969b1)

## About RFC 5545

RFC 5545 defines the Internet Calendaring and Scheduling Core Object Specification (iCalendar). It's essential for developers working with:
- Calendar applications
- Scheduling systems
- Time management tools
- Event management platforms

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kallenkortuem/rfc5545-game.git
cd rfc5545-game
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Hooks** - State management and component logic

## Learning Objectives

After using this application, you should understand:

- **iCalendar Structure**: VCALENDAR containers, components, and properties
- **Event Components**: VEVENT structure and required/optional properties
- **Recurrence Rules**: RRULE syntax and common patterns
- **Date-Time Formats**: UTC timestamps and timezone handling
- **MIME Types**: text/calendar content type
- **Unique Identifiers**: UID property importance and format

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Resources

- [RFC 5545 Specification](https://tools.ietf.org/html/rfc5545)
- [iCalendar.org](https://icalendar.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
