# 🏫 EduDash Portal

The modern, ultra-responsive frontend for the EduDash School Management System. Built with **Next.js 15**, **Tailwind CSS 4.0**, and **Redux Toolkit**, providing a premium experience for students, teachers, and administrators.

---

## ✨ Features

- **🌓 Dynamic Theming**: Sleek dark and light modes with glassmorphism aesthetics.
- **📊 Interactive Dashboards**:
  - **Admin**: Oversee school operations, manage staff/students, and configure schedules.
  - **Teacher**: Manage class modules, record grades, and view teaching timetables.
  - **Student**: Track academic progress, view success rates, and access personal schedules.
- **🗓️ Smart Scheduling**: Visual 5-day grid with "Active Period" highlighting based on real-time.
- **📈 Academic Analytics**: Real-time calculation of success rates and average scores.
- **📱 Responsive Layout**: Optimized for desktop, tablet, and mobile devices with interactive sidebars.
- **⚡ Performance Powered by Edge**: Deployed on Cloudflare Pages using the Next.js Edge Runtime.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API Client**: [Axios](https://axios-http.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (current LTS)
- A running instance of the **EduDash Backend API**

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd newClient
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API base URL:
   Update `src/lib/axios.ts` or set an environment variable to point to your backend.

### Development

Run the development server with Turbo:
```bash
npm run dev
```
Open [http://localhost:8787](http://localhost:8787) to see the result.

---

## 🏗️ Architecture

- **`src/app`**: Next.js App Router folders with role-based routing (`/admin`, `/(portal)/dashboard`).
- **`src/components`**: Atomic UI components and feature-specific widgets (e.g., `TodaysScheduleWidget`).
- **`src/lib/redux`**: Global state management configuration, slices (auth, admin, teacher), and async thunks.
- **`src/types`**: Unified TypeScript interfaces for portal and admin ecosystems.

---

## 🌎 Deployment

The project is optimized for **Cloudflare Pages**. To build for production:
```bash
npm run pages:build
```
Or use the provided deployment script:
```bash
./deploy.sh
```

---

## 🎨 Design System

EduDash uses a "Premium Dark" aesthetic by default:
- **Primary**: Indigo/Purple gradients.
- **Surfaces**: Glassmorphic panels with `backdrop-blur`.
- **Typography**: Inter (System Default) with heavy font weights for high-impact labels.

---

## ⚖️ License
MIT License - Copyright (c) 2025 EduDash Team
