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

## Development Workflow

### Git Workflow
- Always review git history of files being modified with `git log --patch <file>`
- Make atomic, focused commits with descriptive messages
- Commit messages should explain WHAT was changed and WHY
- Always commit changes after testing and before deployment
- Use standard commit format with emoji and co-authorship
- Build and deploy with `npm run build && pm2 restart rsbetc`

## Chat Functionality - Implementation Notes

### Overview
The chat feature includes a customer-facing chat bubble and an employee admin panel. The chat can be serviced by employees or fall back to AI responses.

### Key Files
- `/components/ChatBubble.js` - Customer-facing chat interface
- `/app/chat-admin/page.js` - Employee admin interface
- `/app/chat-admin/layout.js` - Custom layout for admin (no header/footer)
- `/app/api/chat/*` - API endpoints for chat functionality
- `/app/api/chat/ai/route.js` - AI proxy with chat history and system prompt

### Features
1. **Customer Interface**: Floating chat bubble that expands to a full chat interface.
2. **Admin Panel**: Secured admin interface for employees to respond to customer inquiries.
3. **AI Integration**: Automatic AI responses when no employees are available.
4. **Availability Management**: Employees can set themselves as available/unavailable.
5. **Data Management**: Reset functionality to clear chat history and sessions.
6. **Chat History**: AI responses maintain conversation context to avoid "amnesia".

### AI Chat Implementation
- AI responses use Cloudflare worker via a proxy in `/app/api/chat/ai/route.js`
- System prompt includes specific guidance on being helpful with technical information
- For inventory questions, AI should explain: "we have a lot of batteries and probably have that one, but I haven't been connected to the inventory system so you would have to call first"
- AI should provide specific technical information when available (e.g., battery types)
- Chat history is included in the system prompt to maintain context between messages
- The `sessionId` parameter is required to fetch chat history

### Admin Panel Usage
1. Access the admin panel at `/chat-admin`
2. Login with the secure password
3. Set availability status with the red/green button
4. When available, enter your name to identify yourself to customers
5. Select an active chat from the left sidebar
6. Send responses to customer inquiries
7. Use the "Reset Data" button to clear all chat history and start fresh

### Database Management
- When deploying new chat features, use the Reset Data button to clean up test data
- Reset functionality:
  1. Deletes all chat messages
  2. Deletes all chat sessions
  3. Deletes all employee records
  4. Sets all remaining employees to unavailable

### Security 
- Admin panel is secured with a password: `rsbetc3850`
- Availability toggle is protected with forced database updates to ensure consistency
- Special error handling to prevent corrupted states

### Deployment Notes
- Chat functionality works with the existing PM2 setup
- Build process: `npm run build && pm2 restart rsbetc`
- Database is managed via Prisma ORM