# AI Code Review Assistant

A full-stack web application that helps developers improve code quality using AI-powered analysis and static code analysis tools.

## Live Demo
- Frontend: [your Vercel URL]
- Backend API: [your Render URL]

## Features
- User authentication (signup, login, forgot/reset password, profile management)
- Paste code or upload source files for review
- Static code analysis (ESLint for JS/TS, Pylint for Python)
- AI-powered code review (bug detection, code smells, security, performance, best practices) via Groq/Llama 3.3
- Complexity metrics (cyclomatic complexity, function/class counts, lines of code)
- Auto-generated documentation for submitted code
- Review history with search and filtering
- Responsive, custom-designed UI

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **AI**: Groq API (Llama 3.3 70B)
- **Static Analysis**: ESLint, Pylint, Radon
- **Auth**: JWT, bcrypt

## Local Setup
1. Clone the repo
2. `cd backend && npm install`
3. `cd frontend && npm install`
4. Set up `.env` files in both folders (see `.env.example`)
5. `npx prisma migrate dev` in `backend`
6. Run both: `npm run dev` in each folder

## Screenshots
