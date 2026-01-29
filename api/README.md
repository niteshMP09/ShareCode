# API Server

Express.js API server for the application.

## Installation

```bash
npm install
# or
pnpm install
```

## Running the server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint
- `GET /api/data` - Sample data endpoint

## Environment Variables

Create a `.env` file in the api directory:

```
PORT=5000
NODE_ENV=development
```
