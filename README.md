# EV Car Catalog 🚗⚡

A modern, full-stack web application designed for browsing, managing, and bookmarking electric vehicles. Built with performance and user experience in mind, this project serves as a showcase of modern web development using the latest Next.js features and server-side technologies.

## 🌟 Key Features

- **Car Catalog & Discovery:** Browse a comprehensive list of EV cars with detailed specifications, galleries, and statuses (Available, Booked, Sold).
- **User Authentication & Authorization:** Secure JWT-based authentication supporting multiple roles (Admin & User).
- **Favorites System:** Authenticated users can save their favorite cars to their personal collection.
- **Inquiry System:** Built-in contact form allowing users to directly inquire about specific cars.
- **Admin Dashboard Foundation:** Underlying schema robustly supports backend administration for managing car inventory, viewing inquiries, and user management.
- **Modern UI/UX:** Fully responsive design built with Tailwind CSS v4 and dark/light mode support.

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes) (Dark mode)

**Backend & Database:**
- [Prisma ORM](https://www.prisma.io/)
- PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **Authentication:** Custom JWT-based (`jose` & `bcryptjs`)
- `server-only` to strictly enforce secure server-side execution

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js 20+
- npm, yarn, pnpm, or bun
- A PostgreSQL database (e.g., Supabase, Neon, or local Postgres)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ev-car-catalog.git
   cd ev-car-catalog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of your project and add the necessary variables:
   ```env
   # Database connection
   DATABASE_URL="postgresql://user:password@host:port/dbname"
   
   # JWT Configuration
   JWT_SECRET="your_super_secret_jwt_key"
   ```

4. **Initialize the database:**
   Run Prisma migrations to set up your database schema structure.
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🗄️ Database Schema Overview

The database is designed with the following core entities:
- **User:** Manages authentication and roles (`ADMIN` / `USER`).
- **Car:** Stores EV details, features, price, mileage, and availability status.
- **CarImage:** Handles multiple gallery images for each car entity.
- **SavedCar:** Manages the relation for users bookmarking their favorite cars.
- **Inquiry:** Collects user questions and contact requests.

---

> **Note:** This project is actively developed and maintained as part of my professional portfolio. Feel free to explore the codebase to see my coding practices!
