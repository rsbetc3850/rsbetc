# CLAUDE.md - Development Guide

## Build/Test Commands
- Development: `npm run dev`
- Build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`
- Database generation: `npx prisma generate`
- Database migration: `npx prisma migrate dev --name migration-name`
- Database studio: `npx prisma studio`

## Code Style Guidelines
- React functional components with hooks
- ES6+ syntax with arrow functions
- Tailwind CSS for styling
- 2-space indentation
- Next.js app directory structure
- Prisma for database ORM
- Error handling with try/catch blocks and toast notifications
- Imports order: React/Next.js, third-party libraries, local components
- File naming: camelCase for utility files, PascalCase for components
- State management with React hooks (useState, useEffect)
- Form validation with custom validation functions

## Website Style Guide
- Primary color: Red (#B91C1C - red-700)
- Hover state for red: (#991B1B - red-800)
- Background colors: Dark mode with zinc-900 and zinc-800
- Text color: White for maximum contrast
- Input fields: Dark backgrounds (zinc-700/800) with light text
- Accent color for buttons and interactive elements: red-700
- All buttons should use "bg-red-700 hover:bg-red-800 text-white" classes
- All form inputs should use dark backgrounds: "bg-zinc-700/800 border-zinc-600"
- Consistent rounded corners: "rounded-lg" or "rounded-md"
- Consistent spacing: Use Tailwind's built-in spacing utilities
- Font styles: Use the default font stack with appropriate weights