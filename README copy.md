# <p align="center">🏫 EduDash: High-Performance School Management System</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/GraphQL-Yoga-E10098?style=for-the-badge&logo=graphql" alt="GraphQL" />
  <img src="https://img.shields.io/badge/Hono-v4-FF5050?style=for-the-badge&logo=hono" alt="Hono" />
  <img src="https://img.shields.io/badge/Tailwind-CSS_4.0-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare-workers" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" />
</p>

---

## 🌟 Overview

**EduDash** is a modern, ultra-responsive, and high-performance school management ecosystem designed for the serverless era. Built from the ground up to run on **Cloudflare's Edge**, it provides a seamless experience for students, teachers, and administrators through a multi-tenant architecture.

The project is split into two specialized components:
- **`school-client`**: A premium, glassmorphic Next.js 15 frontend.
- **`school-mangemt-system-Api-GraphQl`**: A robust, serverless GraphQL API powered by Hono.

---

## 🏗️ Technical Architecture

### 💻 Frontend (Client)
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router.
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) (Alpha) for ultra-modern UI.
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) for optimized global state.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for premium micro-interactions.
- **Runtime**: [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge) on Cloudflare Pages.

### ⚙️ Backend (API)
- **Framework**: [Hono](https://hono.dev/) - The small, simple, and ultra-fast web framework.
- **API Layer**: [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) with Type-safe resolvers.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) for edge-compatible SQLite management.
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (Distributed SQLite).
- **Security**: JWT-based Auth (JOSE), Bcrypt.js, and Zod validation.

### ✨ Key Features

- **📊 Multi-Tenant Architecture**: Robust school-based isolation ensuring secure data partitioning.
- **🔐 Enterprise-Grade Security**: JWT-based authentication with role-based access control (RBAC).
- **📝 Electronic Exam System**: 
  - **Creation**: Teachers can build exams with automated scoring and point allocation.
  - **Interaction**: Students can take timed exams with real-time countdowns and instant result snapshots.
  - **Analytics**: Comprehensive reporting for teachers on class performance and exam submissions.
- **📈 Advanced Gradebook**: Support for multiple assessment types (Finals, Midterms, Quizzes) with automated average score normalization.
- **🗓️ Intelligent Scheduling**: Dynamic 5-day timetable grid with active period tracking.

### 👑 Administrator Terminal
- **Faculty Registry**: Register and manage teaching staff with specialization tracking.
- **Academic Hierarchy**: Configure classes (Grade 1-12) and assign core subjects.
- **Schedule Orchestrator**: Manage complex weekly timetables with a visual grid.
- **Resource Cleanup**: Intelligent data protection (e.g., preventing deletion of active teachers).

### 👨‍🏫 Teacher Suite
- **Exam Builder**: Create complex assessments with multiple-choice questions.
- **Gradebook Management**: Record and update grades in bulk with auto-save capabilities.
- **Academic Snapshot**: Track class success rates and student performance metrics.

### 🎓 Student Portal
- **Exam Center**: Dedicated interface for taking assigned exams and viewing historical results.
- **Identity & Performance**: Personalized academic ID and real-time average score tracking.
- **Success Mapping**: Breaking down performance by type (Midterm, Final, Quiz).
- **Daily Timetable**: High-impact visual schedule indicating current active periods.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Cloudflare Wrangler CLI
- Cloudflare Account (for D1/Pages deployment)

### Setup Workflow

1. **Backend Initialization**:
   ```bash
   cd school-mangemt-system-Api-GraphQl
   npm install
   # Seed your remote D1 database
   npm run seed:remote
   # Run locally
   npm run dev
   ```

2. **Frontend Initialization**:
   ```bash
   cd school-client
   npm install
   # Run development server (Turbo enabled)
   npm run dev
   ```

---

## 🌎 Deployment Strategy

Both the frontend and backend are optimized for **Cloudflare**.

- **API Deployment**: Deployed as a **Cloudflare Worker**.
- **Frontend Deployment**: Deployed via **Cloudflare Pages**.

Use the included `./deploy.sh` script in the `school-client` directory for seamless CI/CD to Cloudflare.

---

## 🎨 Design Philosophy

EduDash follows a **"Premium Modern"** aesthetic:
- **Glassmorphism**: Backdrop blur effects on surfaces.
- **Dynamic Theming**: True dark/light modes with tailored HSL color palettes.
- **Responsive-First**: Liquid layout that adapts perfectly from mobile to 4K monitors.
- **Micro-Animations**: Purposeful feedback animations via Framer Motion.

---

## ⚖️ License

MIT License - Copyright (c) 2025 **EduDash Team**
