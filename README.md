# Code Share Monorepo

A monorepo containing the Code Share application with both backend API and frontend client.

## Structure

```
.
├── api/          # Express.js backend API
├── client/       # React frontend application
└── package.json  # Root workspace configuration
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

### Install Dependencies

```bash
pnpm install
```

This will install dependencies for all workspaces (api and client).

### Development

Run both API and client in development mode:

```bash
pnpm dev
```

Or run them individually:

```bash
# Run only the API
pnpm dev:api

# Run only the client
pnpm dev:client
```

### Build

Build all packages:

```bash
pnpm build
```

Or build individually:

```bash
# Build only the API
pnpm build:api

# Build only the client
pnpm build:client
```

### Other Commands

```bash
# Lint the client
pnpm lint

# Format API code
pnpm format

# Check API formatting
pnpm format:check

# Clean all node_modules and build outputs
pnpm clean
```

## Workspace Management

This monorepo uses pnpm workspaces. Each package (api and client) maintains its own `package.json` and dependencies.

### Adding Dependencies

To add a dependency to a specific workspace:

```bash
# Add to API
pnpm --filter api add <package-name>

# Add to client
pnpm --filter client add <package-name>

# Add dev dependency
pnpm --filter api add -D <package-name>
```

### Running Commands in Workspaces

```bash
# Run a script in a specific workspace
pnpm --filter <workspace-name> <script-name>

# Run a script in all workspaces
pnpm -r <script-name>
```

## Learn More

- [pnpm Workspace Documentation](https://pnpm.io/workspaces)
- [API README](./api/README.md)
- [Client README](./client/README.md)
