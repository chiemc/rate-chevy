# Rate Chevy

A real-time couples app built for my girlfriend and me, featuring role-based views, a mood journal, a rating system, and a suite of daily check-ins.

## Features

- **Star Rating System** — girlfriend rates her boyfriend on a 1–5 star scale with optional notes
- **Brownie Points** — award and revoke brownie points with reasons tracked in an activity log
- **Mood Journal** — girlfriend writes journal entries with mood tags providing feedback for boyfriend to read and implement; boyfriend can leave comments
- **Traffic Light** — girlfriend sets a red/yellow/green status so the boyfriend knows where he stands
- **Weekly Flowers Check** — girlfriend marks whether she got flowers that week; boyfriend sees a message based on the answer
- **Role-based Views** — girlfriend and boyfriend each see a different UI tailored to their role
- **Real-time Sync** — all updates reflect instantly across both devices via Firestore listeners
- **PWA** — installable on mobile as a home screen app

## Tech Stack

- **Next.js 16** — App Router, file-based routing
- **TypeScript** — type safety throughout
- **Firebase** — Auth for login, Firestore for real-time data storage
- **Tailwind CSS 4** — utility-first styling
- **Framer Motion** — animations
- **next-pwa** — Progressive Web App support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
