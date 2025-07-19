# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.2 application for an RFC5545 (iCalendar) game. It uses:
- React 19.1.0 with TypeScript
- App Router architecture
- Tailwind CSS v4 with PostCSS
- Turbopack for development

## Essential Commands

```bash
# Development
npm run dev        # Start development server with Turbopack on http://localhost:3000

# Production
npm run build      # Create optimized production build
npm run start      # Run production server

# Code Quality
npm run lint       # Run ESLint checks
```

## Architecture

The application follows Next.js App Router conventions:

- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with Geist font setup
- `src/app/page.tsx` - Home page component
- `src/app/globals.css` - Global styles with Tailwind directives

TypeScript path alias: `@/*` maps to `./src/*`

## Key Configuration

- **TypeScript**: Strict mode enabled with modern ES2017 target
- **Tailwind CSS v4**: Using new PostCSS plugin approach
- **ESLint**: Next.js recommended rules with flat config
- **Dark mode**: Configured via CSS custom properties

## Development Notes

- The project currently has the default Next.js starter template
- No RFC5545/iCalendar functionality implemented yet
- No test framework configured
- Uses Geist font family (Sans and Mono variants)