# TravelMind Backend

Backend server for TravelMind application built with Node.js and TypeScript.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

3. Run in development mode:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts          # Main server file
│   ├── types/            # TypeScript type definitions
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env                  # Environment variables
```
