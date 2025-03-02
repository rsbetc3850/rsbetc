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