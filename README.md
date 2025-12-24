# 🏫 School Management System - Frontend

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages-orange?style=for-the-badge&logo=cloudflare)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple?style=for-the-badge&logo=redux)

A modern, high-performance web application for managing school operations. Built with the latest **Next.js 15 App Router**, **Tailwind CSS v4**, and **Redux Toolkit**, designed to run on the **Cloudflare Edge**.

---

## 🚀 Features

- **🎓 Student Portal**: Dedicated area for students to view grades, schedules, and announcements.
- **👨‍🏫 Teacher Management**: Tools for teachers to manage classes and subjects.
- **🛠 Admin Dashboard**: Comprehensive control panel for school administrators.
- **📚 Subject & Class Management**: Organize curriculum and classroom allocations effectively.
- **🔐 Secure Authentication**: Role-based access control and secure login system.
- **⚡ Edge Performance**: Optimized for Cloudflare Pages with edge runtime capabilities.
- **🎨 Modern UI/UX**: Responsive design with **Lucide Icons** and **Framer Motion** animations.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Alpha)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Data Fetching**: Axios & GraphQL
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router pages
│   ├── (portal)/     # Student/Public portal routes
│   ├── admin/        # Admin dashboard routes
│   ├── login/        # Authentication routes
│   └── ...
├── components/       # Reusable UI components
├── services/         # API service calls
├── lib/              # Utility functions and configurations
├── data/             # Static data and constants
└── types/            # TypeScript type definitions
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd newClient
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file (optional for local dev, but required for API connection):
   ```
   NEXT_PUBLIC_API_URL="https://schoolapi.amroaltayeb14.workers.dev/graphql"
   ```

4. **Run Locally:**
   ```bash
   npm run dev
   ```
   The app will happen at `http://localhost:8787` (configured for Cloudflare env compatibility).

---

## 🌐 Deployment (Cloudflare Pages)

This project is configured to be deployed using **Cloudflare Pages** via `@cloudflare/next-on-pages`.

### Build & Deploy

1. **Build the project:**
   ```bash
   npm run pages:build
   ```
   This generates a `.vercel/output/static` directory compatible with Cloudflare.

2. **Preview locally (Wrangler):**
   ```bash
   npm run preview
   ```

3. **Deploy with Wrangler:**
   ```bash
   npx wrangler pages deploy .vercel/output/static
   ```

---

## 📜 Scripts

| Script | Description |
|Args|Description|
|---|---|
| `npm run dev` | Runs the Next.js development server locally. |
| `npm run pages:build` | Builds the app for Cloudflare Pages (Edge). |
| `npm run dev:cloudflare` | Runs the app with Wrangler's Pages dev server simulation. |
| `npm run preview` | Builds and previews the production build locally using Wrangler. |


---

## 📄 License

This project is licensed under the MIT License.

---

Author: Amro Altayeb
