# Google Calendar Frontend

React frontend for the Google Calendar application with authentication and event management.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: SCSS Modules
- **Routing**: React Router DOM v7
- **State Management**: React Context + Hooks
- **Date Utilities**: date-fns

## Prerequisites

- Node.js 20.19+ or 22.12+
- yarn

## Environment Variables

Create a `.env` file in the root directory with the following variable:

```
VITE_API_BASE_URL=http://localhost:4000
```

If not provided, the default value `http://localhost:4000` will be used.

## Installation

```bash
yarn install
```

## Available Scripts

### Development

```bash
yarn dev
```

Starts the development server at `http://localhost:5173` with hot module replacement.

### Build

```bash
yarn build
```

Builds the application for production to the `dist` folder.

### Preview

```bash
yarn preview
```

Locally preview the production build.

### Lint

```bash
yarn lint
```

Runs ESLint to check for code quality issues.


## Browser Support

Modern browsers with ES2022 support.
