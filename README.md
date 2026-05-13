# CronGoal - The open source goal tracking application, designed by/for you!

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

> [!NOTE]
> This README is particularly focused on documenting the **Frontend Web Application** built natively with Next.js (App Router).

## Summary
- [Introduction](#introduction)
- [Core Features](#core-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)

## Introduction
Have you ever wanted to take control of your routine tasks, but never found a simple and intuitive way to do it? If your answer is _Yes_, you're exactly in the right place!
Welcome to CronGoal, the open-source goal-tracking application designed with simplicity in mind!

This repository houses the Frontend Web UI of the CronGoal ecosystem. Built on top of Next.js, it offers a seamless, fast, and highly responsive user experience to manage your goals, complete daily routines, and claim rewards. 

## Core Features
- **Interactive Dashboard:** A centralized view of your progress, upcoming tasks, and quick actions.
- **Dynamic Kanban Board:** Visually manage your project tasks with a flexible column structure.
- **Routine & Task Management:** Easily create, update, and track daily routines and specific tasks through intuitive pop-ups and cards.
- **Gamification Interface:** Engaging UI for tracking points (`PointsContext`) and redeeming rewards to boost daily consistency and habit building.
- **Secure Access & Auth Guards:** Protected routes and a seamless authentication flow that integrates natively with the backend API.
- **Responsive Design:** Fully responsive layout built with modern CSS practices for both desktop and mobile views.

## Architecture & Tech Stack
This frontend is built leveraging modern web technologies to ensure a scalable and maintainable codebase, mirroring the strictness and structure of the backend API.

- **Framework:** [Next.js](https://nextjs.org/) using the modern App Router (`app/` directory).
- **Library:** [React](https://reactjs.org/) for building reusable user interfaces.
- **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety, enhanced developer experience, and shared interfaces (`types/`).
- **Styling:** Tailwind CSS (via PostCSS) for utility-first, scalable responsive styling.
- **Validation:** Zod schemas (`schemas/`) for strict frontend form validation, sharing the exact same structure as the backend DTOs.
- **State Management:** React Context (`contexts/PointsContext.tsx`) for global point tracking and standard React hooks for local state.
- **API Integration:** Abstracted service layer (`services/`) utilizing a central API client (`lib/api.ts`) to communicate with the Express backend.

## Project Structure

```text
app/                    # Next.js App Router pages and nested layouts
├── (auth)/             # Authentication routes (login, register, logout)
├── (dashboard)/        # Protected dashboard routes (projects, tasks, rewards, routines, etc.)
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
└── api.ts              # Axios or Fetch based API client configuration
schemas/                # Zod validation schemas (mirrors backend schemas)
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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- Running instance of the **CronGoal Backend API** (Refer to the backend README for setup).

### 1. Clone the repository
```bash
git clone https://github.com/your-username/dpa-crongoal-frontend.git
cd dpa-crongoal-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` or `.env.local` file in the root directory:
```env
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Optional: Next.js specific environment variables
# NEXT_PUBLIC_FE_URL="http://localhost:3000"
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`. 

## Roadmap
- [x] **Phase 1:** Next.js project scaffolding and folder architecture setup
- [x] **Phase 2:** Base UI components and Layouts (Navbar, Sidebar, Landing Page)
- [x] **Phase 3:** Integration of standard forms with Zod validation schemas
- [x] **Phase 4:** API Service abstractions and Context providers setup
- [x] **Phase 5:** Core domain pages (Dashboard, Projects, Tasks, Routines, Rewards)
- [x] **Phase 6:** Kanban Board visual implementation
- [ ] **Phase 7:** Advanced drag-and-drop mechanics for Kanban
- [ ] **Phase 8:** Comprehensive test coverage (Jest / Cypress)
- [ ] **Phase 9:** PWA Setup & offline support
- [ ] **Phase 10:** Light/Dark theme final polish

---
**If you like what you see here, give it a ⭐️ and follow me for future updates and projects!**
