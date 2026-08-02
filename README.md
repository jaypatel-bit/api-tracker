# APIRadar

APIRadar is a Next.js SaaS app for tracking API changes across marketing and analytics platforms such as GA4, Google Ads, and Meta. It helps teams detect changelog updates, classify severity, and move high-risk changes through a shared review workflow.

## Live App

- Public URL: https://api-tracker-nine.vercel.app
- Public demo: visit `/signup` or `/login` and continue into the sample workspace without setting up a database

## Product Focus

- Monitor provider changelogs, docs, and release surfaces
- Classify changes like breaking updates, deprecations, and migration notices
- Subscribe teams to providers that matter to their reporting and campaign stack
- Triage detected changes on a Kanban-style board

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Drizzle ORM
- Neon Postgres
- Better Auth

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables in `.env.local` for your database, auth, Anthropic, and email providers.

3. Run database migrations or push the schema:

```bash
npm run db:push
```

4. Seed the initial provider set:

```bash
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

## Seeded Providers

The default seed script includes official vendor sources for:

- GA4 Data API
- GA4 Measurement Protocol
- Google Ads
- Meta Marketing API
- Looker Studio
- LinkedIn Marketing Developer Platform

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:seed`
- `npm run db:studio`
