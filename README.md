# AI Code Review Assistant

A full-stack web application that helps developers improve code quality using AI-powered analysis, static code analysis tools, and automated documentation generation — acting as an automated, always-available code reviewer.

Instead of waiting on a senior developer, users can paste a code snippet or upload a source file and instantly receive a structured report covering bugs, code smells, security concerns, performance issues, complexity metrics, and auto-generated documentation.

## Live Demo

- **Frontend:** https://ai-code-review-assistant-ochre-ten.vercel.app
- **Backend API:** https://ai-code-review-assistant-9bt8.onrender.com
- **Repository:** https://github.com/ishitasinghvi2006-sys/ai-code-review-assistant

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

## Features

### Authentication
- Sign up, log in, log out
- Forgot password / reset password via email (Nodemailer + Gmail)
- Profile view and update

### Code Submission
- Paste a code snippet directly, or upload a source file
- Supported languages: JavaScript, TypeScript, Python, Java
- File type and size validation on upload

### Static Code Analysis
- **JavaScript / TypeScript:** ESLint (unused variables, undefined variables, loose equality, `var` usage, unreachable code, and more)
- **Python:** Pylint (unused variables, style issues, and more)
- Issues categorized by severity (High / Medium / Low) with line numbers

### AI-Powered Code Review
- Bug detection
- Code smell identification
- Security concerns
- Performance suggestions
- Best-practice recommendations
- Powered by Groq's hosted Llama 3.3 70B model via an OpenAI-compatible API

### Complexity Analysis
- Cyclomatic complexity
- Function count
- Class count
- Lines of code
- Computed via AST parsing (Acorn) for JS/TS and Radon for Python

### Auto-Generated Documentation
- Plain-language explanation of what the submitted code does
- Per-function/class documentation (purpose, parameters, return values)
- Rendered as formatted Markdown

### Review Dashboard
- List of all past reviews
- Search by title
- Filter by language and source type (pasted / uploaded)
- Delete reviews
- Detailed report view per review

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon, production) |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Static Analysis | ESLint (JS/TS), Pylint (Python) |
| Complexity Analysis | Acorn (JS/TS AST parsing), Radon (Python) |
| AI Review & Docs | Groq API (Llama 3.3 70B, OpenAI-compatible) |
| File Uploads | Multer |
| Notifications | react-hot-toast |
| Hosting | Vercel (frontend), Render (backend), Neon (database) |

## Project Structure

```
ai-code-review-assistant/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Migration history
│   └── src/
│       ├── controllers/        # Route handlers (auth, reviews)
│       ├── middleware/         # JWT auth middleware
│       ├── routes/             # Express route definitions
│       ├── services/           # Static analysis, AI review, complexity, docs, email
│       ├── utils/
│       ├── prismaClient.js
│       └── index.js            # Server entry point
└── frontend/
    └── src/
        ├── api/                # Axios instance with auth interceptors
        ├── components/         # Navbar, ProtectedRoute
        ├── context/            # AuthContext
        ├── pages/               # Login, Signup, Dashboard, NewReview, ReviewDetail, Profile, NotFound
        ├── App.jsx              # Routing
        └── main.jsx
```

## Database Schema

- **User** — account info, hashed password
- **Review** — submitted code, title, language, source type, generated documentation
- **StaticIssue** — one row per static analysis finding, linked to a Review
- **AiIssue** — one row per AI-generated finding, linked to a Review
- **ComplexityMetric** — one row per Review, holding computed metrics

## Local Setup

### Prerequisites
- Node.js (LTS)
- PostgreSQL
- Python 3 with `pip`
- A Groq API key (free tier available at [console.groq.com](https://console.groq.com))
- A Gmail account with an App Password (for password reset emails)

### 1. Clone the repository
```bash
git clone https://github.com/ishitasinghvi2006-sys/ai-code-review-assistant.git
cd ai-code-review-assistant
```

### 2. Backend setup
```bash
cd backend
npm install
pip install pylint radon
```

Create `backend/.env`:
```
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_code_review?schema=public"
JWT_SECRET=your_long_random_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
GROQ_API_KEY=your_groq_api_key
```

Run migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in, receive a JWT |
| POST | `/api/auth/forgot-password` | Request a password reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password using emailed token |
| GET | `/api/auth/profile` | Get logged-in user's profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |
| POST | `/api/reviews` | Submit code for review — paste or file upload (protected) |
| GET | `/api/reviews` | List reviews, supports `?search=`, `?language=`, `?sourceType=` (protected) |
| GET | `/api/reviews/:id` | Get full details of a single review (protected) |
| DELETE | `/api/reviews/:id` | Delete a review (protected) |

Protected routes require an `Authorization: Bearer <token>` header.

## Security Notes

- Passwords are hashed with bcrypt before storage, never stored or returned in plain text
- JWTs expire after 7 days; password reset tokens expire after 15 minutes
- Forgot-password responses are identical whether or not the email exists, to prevent account enumeration
- Uploaded files are restricted by type and size, and are processed in memory rather than saved to disk
- Reviews are scoped per-user; a user cannot view, edit, or delete another user's reviews

## Future Improvements

- GitHub repository ingestion (was scoped out of this build)
- Support for additional languages (C++, Go, Ruby)
- Team/organization accounts with shared review history
- Inline diff view for suggested fixes
- Export reports as PDF

## Author

Built as a student/internship-level full-stack project demonstrating API integration, authentication, AI-powered application design, static code analysis tooling, and full-stack deployment.