# ⚡ EV Car Catalog & Admin Dashboard

<div align="center">
  <img width="800" alt="Hero Image" src="https://github.com/user-attachments/assets/08822099-3032-43a1-b171-da4cb6673cd2" />
  <p><em>A modern, high-performance catalog and management system for Electric Vehicles.</em></p>
</div>

---

## 📸 System Screenshots

### 🚗 Public Client (User-Facing)
The storefront features a modern, responsive UI designed for optimal user experience and fast loading times.

| Catalog / Filter | Car Details | Car Comparison |
| :---: | :---: | :---: |
| <img width="400" alt="Client 1" src="https://github.com/user-attachments/assets/41dd9e55-7ade-4249-b8b8-14f7339187c7" /> | <img width="400" alt="Client 2" src="https://github.com/user-attachments/assets/2996d6b7-7508-4adb-a133-84d8abe24da5" /> | <img width="400" alt="Client 3" src="https://github.com/user-attachments/assets/e8947b2e-ab4a-4a79-9867-8557126a38ba" /> |

### 🔒 Admin Dashboard (CMS)
A secure, RBAC-protected management portal to handle EV data, specifications, and media assets with Supabase Storage integration.

| Dashboard Overview | User & Role Management |
| :---: | :---: |
| <img width="500" alt="Dashboard 1" src="https://github.com/user-attachments/assets/345a4143-3d96-430d-abff-29af0cc1ea97" /> | <img width="500" alt="Dashboard 2" src="https://github.com/user-attachments/assets/1c6c4eca-99d6-497e-9969-94e23afad651" /> |

| Add / Edit Entry Form |  Customer Inquiries |
| :---: | :---: |
| <img width="500" alt="Dashboard 3" src="https://github.com/user-attachments/assets/96508415-7916-4c64-8d55-db076d7d01ff" /> | <img width="500" alt="Dashboard 4" src="https://github.com/user-attachments/assets/1428396e-7392-4889-b1b6-dc7992104b86" /> |

> A robust, production-ready full-stack catalog and management system for Electric Vehicles, built with performance, security, and clean architecture in mind.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL + Object Storage)
- **Validation:** [Zod](https://zod.dev/)
- **Styling:** Tailwind CSS
- **Containerization:** Docker (Multi-stage build)

## 🌟 Key Features & Production-Ready Highlights

During the development of this project, significant emphasis was placed on writing clean, secure, and resilient code suitable for enterprise environments.

### 🔐 Security & RBAC (Role-Based Access Control)
- **Secure Mutations:** Every server action (Create, Update, Delete) enforces strict session-based Admin verification before execution.
- **Protected Routes & Actions:** Unauthorized access attempts are actively rejected at the server level, ensuring no data can be manipulated without the `ADMIN` role.

### 🛡️ Data Integrity & Validation
- **Strict Input Validation:** Utilizes **Zod** to validate all incoming form data on the server side. Ensures that numerical values (price, mileage, year) are positive and strings are properly formatted before hitting the database.
- **File Validation:** Dedicated validation logic checks file sizes (max 5MB) and MIME types (`image/*`) to prevent malicious uploads.

### 🏗️ Clean Architecture
- **Separation of Concerns:** Business logic is clearly decoupled. Database mutations live in dedicated controller files, while external storage interactions are abstracted away into focused service layers (e.g., `lib/supabase-storage.ts`).

### ⚙️ Fail-Safe Mechanisms & Transactions
- **Orphaned-File Rollback:** Implemented comprehensive `try/catch` blocks. If a Prisma database transaction fails during car creation or update, any newly uploaded images to Supabase are automatically rolled back (deleted) to prevent storage bloat and orphaned files.
- **Safe Deletion Sequence:** When deleting a record, the database entry is removed *first*. Only upon success are the associated images deleted from Supabase, guaranteeing data consistency.

### 🔍 SEO & Robust File Naming
- **Collision-Proof Uploads:** Image uploads are renamed using `crypto.randomUUID()` to prevent naming collisions and security risks in the storage bucket.
- **Dynamic SEO Slugs:** Generates clean, human-readable, and SEO-friendly URL slugs automatically from the car's brand and model (e.g., `tesla-model-3`).

### 🐳 Containerization & Deployment
- **Optimized Multi-Stage Builds:** The Docker environment utilizes a multi-stage architecture to aggressively reduce final image sizes by isolating build dependencies from runtime assets via the Next.js `standalone` output mode.
- **Secure Execution Environment:** Engineered to execute the runtime server using a dedicated non-root user (`nextjs:nodejs`), conforming to best security practices and minimizing vulnerability surfaces in production.

## 🗄️ Database Schema

The relational database is structured to support scalability and complex querying:

- **`User`**: Manages accounts with defined roles (`USER` or `ADMIN`).
- **`Car`**: The core entity storing EV details, pricing, and status (`AVAILABLE`, `BOOKED`, `SOLD`).
- **`CarImage`**: A related table (1-to-N) storing gallery images with explicit ordering.
- **`SavedCar`**: A join table allowing Users to save/favorite specific Cars (N-to-M relationship).
- **`Inquiry`**: Stores customer contact requests and appointment inquiries.

## 🛠️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ev-car-catalog.git
cd ev-car-catalog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Prisma (PostgreSQL)
DATABASE_URL=your_database_connection_string
```

### 4. Database Setup
Generate the Prisma Client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
