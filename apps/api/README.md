# Google Calendar API Backend

Express backend for the Google Calendar application with OAuth2 authentication and event management.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7
- **Validation**: Zod
- **Authentication**: JWT + Google OAuth 2.0

## Prerequisites

- Node.js 20.19+ or 22.12+
- Docker & Docker Compose
- Google Cloud Project with OAuth 2.0 credentials
- yarn

## Quick Start

### 1. Start PostgreSQL Database

From the repository root, start the PostgreSQL container:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

This starts PostgreSQL 16 on `localhost:5432` with:
- **User**: `calendar_user`
- **Password**: `calendar_pass`
- **Database**: `calendar_db`

### 2. Install Dependencies

Navigate to the API directory and install packages:

```bash
cd apps/api
yarn install
```

### 3. Environment Variables

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

### 5. Database Setup

Run Prisma migrations and generate the client:

```bash
yarn prisma migrate dev
yarn prisma generate
```

### 6. Start Development Server

```bash
yarn dev
```

The API will be available at `http://localhost:4000`

## Available Scripts

### Development

```bash
yarn dev
```

Starts the development server at `http://localhost:4000` with hot reload.

### Build

```bash
yarn build
```

Compiles TypeScript to JavaScript in the `dist/` folder.

### Production

```bash
yarn start
```

Runs the compiled production build.

### Database

```bash
# Generate Prisma client
yarn prisma generate

# Run migrations
yarn prisma migrate dev

# Open Prisma Studio
yarn prisma studio
```

### Endpoints

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

**Prisma Client Errors**
```bash
yarn prisma generate
```

**Database Connection Issues**
```bash
# Check if PostgreSQL container is running
docker ps

# Restart the container
docker-compose -f docker/docker-compose.yml restart
```
