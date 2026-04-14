---
name: setup
description: Install dependencies and configure the local dev environment
disable-model-invocation: true
allowed-tools: Bash(pnpm *) Bash(cp *) Bash(docker *) Read
---

Set up the local development environment:

1. Install dependencies: `pnpm install`
2. Copy environment file if it doesn't exist: `cp -n .env.example .env`
3. Generate Prisma client: `pnpm prisma generate`
4. Run database migrations: `pnpm prisma migrate dev`
5. Seed the database if a seed script exists: `pnpm prisma db seed`
6. Verify the setup by running: `pnpm test`
7. Print a summary: which services to start, what ports they use, any remaining manual steps
