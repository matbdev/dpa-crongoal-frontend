> 🇧🇷 [Ver em Português](README.md) · 🔗 [View Backend](https://github.com/matbdev/dpa-crongoal-backend/blob/main/README-en.md)

# CronGoal — The open source goal tracking application, designed by/for you!

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

> Complete web interface for the CronGoal ecosystem — built with Next.js (App Router) + React + TypeScript, focused on user experience, responsiveness, and full backend API integration.

---

## What it is

CronGoal is a gamified personal productivity application that helps users organize tasks, routines, and projects in a visual and intuitive way. This repository contains the **web frontend** — the interface users see and interact with directly.

If you've ever tried to take control of your routine but never found a tool simple enough for it, this project was made for you. The goal is to eliminate unnecessary complexity and deliver a straightforward experience — without spending more time configuring the tool than actually managing your goals.

## Why it exists

This project was born within the **Internet Application Development (DAI)** course at **UNIVATES**, but it goes beyond an academic deliverable. The real motivation came from frustration with productivity tools that are either too simple to sustain real use, or so complex they become yet another obstacle.

CronGoal fills that gap: it's robust enough to track projects with Kanban, periodic routines, and a gamified reward system — but without requiring an absurd learning curve. The idea is for it to work as a daily ally, not another obligation.

## How it works

- **Primary language:** TypeScript
- **Framework / Runtime:** Next.js 16 (App Router) on React 19
- **Styling:** Tailwind CSS 4 via PostCSS
- **Validation:** Zod (schemas mirrored from backend) + React Hook Form
- **Global state:** React Context (`PointsContext`) for real-time gamification
- **API integration:** Abstracted service layer via Axios with centralized client (`lib/api.ts`)
- **Reports:** Programmatic PDF generation (pdfmake) and CSV export with advanced filters
- **Theming:** Dark/light mode support via `next-themes`

### Project structure

```
app/                    # Next.js App Router pages and nested layouts
├── (auth)/             # Authentication routes (login, register, logout)
├── (dashboard)/        # Protected routes (projects, tasks, rewards, routines)
├── favicon.ico
├── globals.css         # Global stylesheets (Tailwind imports)
├── layout.tsx          # Root layout
├── page.tsx            # Landing page
└── providers.tsx       # Global React context providers
components/             # Reusable modular React components
├── auth/               # Authentication forms (Login, Register)
├── dashboard/          # Dashboard specific components
├── home/               # Landing page components (Features, Steps, Values)
├── kanban/             # Kanban board, columns, and cards
├── layout/             # Navbar, Sidebar, PopUps, Toasters, AuthGuards
├── projects/           # Project related components
├── rewards/            # Reward related components
├── routines/           # Routine related components
├── tasks/              # Task related components
└── ui/                 # Generic, atomic UI elements (Badges, Buttons, etc.)
contexts/               # React Context providers
└── PointsContext.tsx   # Global state for user's gamification points
lib/                    # Utility libraries
└── api.ts              # Centralized HTTP client (Axios)
schemas/                # Zod validation schemas (mirrors backend DTOs)
├── auth.schema.ts
├── kanban.schema.ts
└── ...
services/               # API call wrappers organized by domain
├── auth.service.ts
├── kanban.service.ts
└── ...
types/                  # Custom TypeScript type definitions
├── kanban.ts
├── project.ts
└── ...
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Running instance of the **CronGoal Backend API** (see the [backend repository](https://github.com/matbdev/dpa-crongoal-backend/blob/main/README-en.md))

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/matbdev/dpa-crongoal-frontend.git
cd dpa-crongoal-frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.template .env.local
# Edit .env.local with your backend URL

# 4. Start the development server
npm run dev
```

Then open `http://localhost:5001` in your browser.

## Demo

| Screenshot | Description |
|:--:|:--|
| ![Landing page](assets/initial-page.png) | **Landing page** — Initial screen with CTA and product overview |
| ![Dashboard](assets/dashboard-page.png) | **Dashboard** — Overview with metrics, weekly charts, and daily progress |
| ![Projects](assets/projects-page.png) | **Projects** — Project cards with status, deadline, and task count |
| ![Tasks (Kanban)](assets/task-page.png) | **Tasks** — Kanban board with To Do, In Progress, and Done columns |
| ![Rewards](assets/rewards-page.png) | **Rewards** — Redeemable reward catalog with point costs |
| ![Routines](assets/routine-page.png) | **Routines** — Routine listing with periodicity and task totals |
| ![Routine tasks](assets/routine-tasks-page.png) | **Routine tasks** — Internal Kanban for a specific routine |
| ![Reports modal](assets/reports-export-modal.png) | **Reports** — Modal with full listing options and filterable reports |
| ![Export with filters](assets/task-export-example-modal.png) | **Export** — Advanced filters for generating task PDF or CSV |

## Technical decisions

- **Next.js App Router over Pages Router:** The App Router adoption was intentional to leverage Server Components, nested layouts, and natural route-based organization. The `(auth)` and `(dashboard)` folders use route groups to separate layouts without affecting the URL.

- **Tailwind CSS 4:** Tailwind was chosen for prototyping speed and visual consistency. The entire design system is based on utility classes, eliminating the need for custom CSS for most components while keeping the bundle lean.

- **Zod mirrored from backend:** The frontend validation schemas exactly replicate the backend DTOs. This ensures that a form passing local validation will be accepted by the API without surprises. Integration with React Hook Form via `@hookform/resolvers` makes this transparent.

- **PointsContext as global state:** Instead of using a state management library (Redux, Zustand), the points system uses a simple Context. The reason: CronGoal needs very little global state — basically just the points balance. Adding an entire library would be overengineering.

- **Client-side report generation:** The decision to generate PDFs and CSVs directly on the client (via `pdfmake`) was intentional. This avoids extra load on the backend, allows dynamic filters without additional roundtrips, and gives users full control over what to export before generating the file.

- **Gamification as a first-class feature:** The points and rewards system wasn't a "nice to have" — it was designed from the start as a central part of the experience. Every completed task generates points; every redeemed reward deducts points. The redemption history is tracked in full.

## Next steps

- [ ] E2E tests with Playwright for critical flows
- [ ] Offline mode with Service Worker and local cache
- [ ] Push notifications for pending routines
- [ ] Production deploy with CI/CD
- [ ] Internationalization (i18n)

## About

Made by **Mateus Carniel Brambilla** ([@matbdev](https://github.com/matbdev)) as part of the Internet Application Development (DAI) academic discipline at UNIVATES.

Submitted to [`git show 2026`](https://jeferson-scheibler.github.io/git-show-dati/),
an initiative by the Diretório Acadêmico de Tecnologia da Informação (DATI) at UNIVATES.

[![git show 2026](https://img.shields.io/badge/git_show-2026-79f2c5?style=flat-square&labelColor=000000)](https://jeferson-scheibler.github.io/git-show-dati/)
