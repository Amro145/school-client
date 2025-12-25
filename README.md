# 🎓 EduDash - Frontend

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-cyan)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)

**EduDash** is a state-of-the-art School Management System frontend designed for high performance, visual elegance, and seamless user experience. Built with the latest web technologies, it provides distinct, secure portals for Students, Teachers, and Administrators.

---

## ⚡ Project Analysis & Architecture

This project adopts a **modern, scalable architecture** leveraging the `App Router` in Next.js 15.

### 🏗️ Architectural Highlights
*   **Feature-First Structure**: Code is organized by domain features (`features/dashboard`, `features/grades`) rather than just technical layers, making the codebase maintainable and scalable.
*   **State Management Strategy**:
    *   **Global State**: Managed via **Redux Toolkit** for complex cross-component data (User session, Admin dashboard stats, Classroom data).
    *   **Server State & Caching**: **Axios** with interceptors handles API data fetching, error handling, and token injection seamlessly.
*   **Design System**:
    *   Built on **Tailwind CSS v4** (Alpha) for ultra-fast styling.
    *   **Dark Mode First**: Native support for dark/light themes using CSS variables and `next-themes`.
    *   **Glassmorphism**: Custom utility classes for premium glass-like UI effects.
    *   **Animations**: **Framer Motion** and native CSS animations (`animate-float`) bring the interface to life.
*   **Edge Compatibility**: configured to run on **Cloudflare Pages** (Edge Runtime), ensuring global low-latency access.

### 🛠️ Core Technologies
| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | App Router, Server Components, Edge Runtime |
| **Styling** | **Tailwind CSS v4** | Utility-first styling, CSS Variables, Theme Configuration |
| **State** | **Redux Toolkit** | Centralized state for Auth, Admin Data, and UI consistency |
| **UI Library** | **Lucide React** | Consistent, crisp vector icons |
| **Motion** | **Framer Motion** | Complex layout animations and transitions |
| **Network** | **Axios** | HTTP Client with centralized interceptors for JWT Auth |
| **Fonts** | **Geist & Outfit** | Modern, readable typography |

---

## 🚀 Key Features

### 🛡️ Role-Based Portals
*   **Admin Dashboard**: comprehensive control center to manage Users (Students/Teachers), Classes, Subjects, and view school-wide analytics.
*   **Teacher Portal**: Tools for grade entry, subject management, and student performance tracking.
*   **Student Portal**: Personal dashboard for viewing grades, assignments, and academic progress.

### 🎨 Visual Experience
*   **Dynamic Landing Page**: A responsive, animated hero section that guides users to their respective login portals.
*   **Interactive UI**: Hover effects, smooth transitions, and distinct color-coding for different roles (Blue for Students, Purple for Teachers, Green for Admins).
*   **Responsive**: Fully optimized for Desktop, Tablet, and Mobile devices.

---

## 📂 Folder Structure

The project follows a clean, opinionated structure inside `src/`:

```bash
src/
├── 📂 app/                 # Next.js App Router (Pages & Layouts)
│   ├── (dashboard)/        # Protected dashboard routes (Admin/Student/Teacher)
│   ├── login/              # Authentication pages
│   ├── layout.tsx          # Root layout with Providers (Redux/Theme)
│   └── page.tsx            # Animated Landing Page
├── 📂 components/          # Shared UI Atoms (Buttons, Cards, Modals)
├── 📂 features/            # Domain-specific logic & components
│   └── dashboard/          # Dashboard widgets and charts
├── 📂 lib/                 # Core configurations
│   ├── axios.ts            # Http client setup
│   └── redux/              # Redux Store & Slices
├── 📂 services/            # API Layer (Decoupled from UI)
│   ├── user-service.ts     # User CRUD operations
│   └── student-service.ts  # Student-specifc logic
└── 📂 types/               # TypeScript Definitions
```

---

## 🏎️ Getting Started

### 1. Installation
Clone the repo and install dependencies:

```bash
npm install
# or
bun install
```

### 2. Configuration
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://y.com/graphql
```

### 3. Run Locally
Start the development server with TurboPack for instant HMR:

```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 🧪 Custom Scripts

*   `npm run dev:cloudflare`: Run using the Cloudflare Pages local simulator.
*   `npm run pages:build`: Build the app for Cloudflare Pages deployment.

---

*Verified Analysis by Antigravity Agent.*
