# Google Calendar Fullstack Application

A fullstack TypeScript application for managing Google Calendar events with OAuth2 authentication.

## Tech Stack

**Frontend** (React 19 + TypeScript + Vite)
- SCSS Modules for styling
- React Router DOM v7
- React Context for state management

**Backend** (Express + TypeScript + PostgreSQL)
- Prisma 7 ORM
- Google OAuth 2.0
- JWT authentication
- Zod validation

## Prerequisites

- Node.js 20.19+ or 22.12+
- Docker & Docker Compose
- Google Cloud Project with OAuth 2.0 credentials
- yarn

## Quick Start

**TL;DR - Run these commands in order:**

```bash
# 1. Install all dependencies (from root)
yarn install

# 2. Start PostgreSQL
docker-compose -f docker/docker-compose.yml up -d

# 3. Setup backend
cd apps/api
# Create .env file here (see step 3 below)
yarn prisma migrate dev
yarn prisma generate
yarn dev

# 4. In a new terminal, setup frontend
cd apps/web
# Create .env file here (see step 6 below)
yarn dev
```

Then setup Google OAuth credentials (see step 8) and visit `http://localhost:5173`

---

### 1. Install Dependencies

From the repository root, install all dependencies:

```bash
yarn install
```

This will install dependencies for both frontend and backend (monorepo workspace setup).

### 2. Start PostgreSQL Database

From the repository root:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This starts PostgreSQL 16 on `localhost:5432` with:
- **User**: `calendar_user`
- **Password**: `calendar_pass`
- **Database**: `calendar_db`

### 3. Setup Backend Environment

Navigate to the API directory:

```bash
cd apps/api
```

Create a `.env` file in `apps/api/`:

```env
PORT=4000
DATABASE_URL=postgresql://calendar_user:calendar_pass@localhost:5432/calendar_db
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
APP_URL=http://localhost:5173
API_URL=http://localhost:4000
JWT_SECRET=your-secret-key-min-32-chars-long
```

**Note**: `JWT_SECRET` must be at least 32 characters.

### 4. Setup Database

Run database migrations:

```bash
yarn prisma migrate dev
yarn prisma generate
```

### 5. Start Backend

```bash
yarn dev
```

Backend will run at `http://localhost:4000`

### 6. Setup Frontend Environment

Open a new terminal and navigate to the web directory:

```bash
cd apps/web
```

Create a `.env` file in `apps/web/`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### 7. Start Frontend

```bash
yarn dev
```

Frontend will run at `http://localhost:5173`

### 8. Setup Google OAuth (Required for Login)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Calendar API**
4. Configure **OAuth consent screen**:
   - Add your email as a test user
   - Add scopes: `calendar.events`, `userinfo.email`, `userinfo.profile`
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
7. Copy Client ID and Client Secret to `apps/api/.env`

### 9. Access Application

Open `http://localhost:5173` in your browser and log in with Google.

## Project Structure

```
google-calendar-fullstack/
├── apps/
│   ├── api/          # Express backend (port 4000)
│   └── web/          # React frontend (port 5173)
├── docker/           # PostgreSQL Docker setup
└── packages/
    └── shared/       # Shared types
```

## Available Commands

### Backend (apps/api)

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Run production build
yarn prisma generate  # Generate Prisma client
yarn prisma studio    # Open Prisma Studio
```

### Frontend (apps/web)

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build
yarn lint             # Run ESLint
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/auth/google` | Initiate OAuth flow |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/me` | Get current user |
| GET | `/events?range=7` | Get events (1, 7, or 30 days) |
| POST | `/events/sync` | Sync from Google Calendar |
| POST | `/events` | Create new event |

## Troubleshooting

**"Cannot find module 'dotenv/config'" error**

This means you need to install dependencies first. Run from the repository root:
```bash
yarn install
```

**Database connection issues**
```bash
# Check if PostgreSQL container is running
docker ps

# Restart container
docker-compose -f docker/docker-compose.yml restart
```

**Prisma client errors**
```bash
cd apps/api
yarn prisma generate
```

**OAuth errors**
- Verify redirect URI matches exactly in Google Cloud Console
- Ensure your email is added as a test user in OAuth consent screen
- Check that all required scopes are enabled

## Documentation

- [Backend README](./apps/api/README.md) - Detailed backend documentation
- [Frontend README](./apps/web/README.md) - Detailed frontend documentation