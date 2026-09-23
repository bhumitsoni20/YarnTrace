# YarnTrace — Yarn Inventory & Production Traceability System

Enterprise-grade yarn inventory and production traceability platform built to replace traditional spreadsheet trackers with end-to-end multi-facility batch tracking.

---

## 1. Project Overview

YarnTrace tracks the complete lifecycle of yarn across industrial textile operations:

```
Yarn Received / Opening
        ↓
    Stock Head
        ↓
   Yarn Issued
        ↓
Production Team Head
        ↓
Production Consumption
        ↓
   Final Product
        ↓
  Party Delivery
```

### Core Business Objectives:
- Real-time stock balance tracking in **KG** with exact `Decimal(12, 4)` precision.
- **Two-way end-to-end traceability**:
  - **Forward**: Yarn Lot $\rightarrow$ Production Allocation $\rightarrow$ Finished Goods $\rightarrow$ Party Delivery.
  - **Backward**: Party / Dispatched Product $\rightarrow$ Production Batches $\rightarrow$ Raw Yarn Lots.
- Granular Role-Based Access Control (RBAC) and comprehensive audit logging.

---

## 2. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Stitch Design System ("Industrial Loom & Trace" light orange/amber theme), Redux Toolkit, TanStack Query, React Hook Form, Zod, Axios, Lucide React, Recharts, ESLint, Prettier.
- **Backend**: Node.js, NestJS, TypeScript, REST API, Swagger / OpenAPI, JWT (Access + Refresh Token), Bcrypt, class-validator, class-transformer.
- **Database**: PostgreSQL with Prisma ORM.
- **No Docker / No Firebase / No Zustand**: Strictly decoupled standard architecture.

---

## 3. Project Structure

```
yarntrace/
├── frontend/                     # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/                  # App routes (/login, /dashboard, /inventory, etc.)
│   │   ├── components/           # UI, Layout, Forms, Common reusable components
│   │   ├── features/             # Domain modules (auth, inventory, production, etc.)
│   │   ├── store/                # Redux Toolkit store, authSlice, uiSlice, typed hooks
│   │   ├── lib/                  # Axios instance, QueryClient, utility helpers
│   │   ├── types/                # Shared TypeScript definitions
│   │   └── constants/            # Nav links, permissions, API paths
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      # NestJS REST API Backend
│   ├── src/
│   │   ├── main.ts               # Entrypoint with Swagger, CORS, validation pipe
│   │   ├── app.module.ts         # Root NestJS module
│   │   ├── prisma/               # Prisma service & client lifecycle
│   │   ├── common/               # Guards, decorators, filters, interceptors
│   │   ├── auth/                 # JWT Auth, refresh token flow, bcrypt hashing
│   │   ├── users/                # User management
│   │   ├── roles/                # Roles & permissions
│   │   ├── inventory/            # Inventory & stock balance
│   │   ├── production/           # Production teams, work orders & consumption
│   │   ├── traceability/         # Traceability engine
│   │   ├── audit/                # Immutable audit log service
│   │   └── health/               # Health check endpoint
│   ├── prisma/
│   │   └── schema.prisma         # Prisma schema with 17 relational entities
│   └── package.json
│
├── docs/                         # Technical documentation
│   ├── architecture.md
│   ├── database.md
│   ├── authentication.md
│   ├── permissions.md
│   └── development-roadmap.md
│
├── .gitignore
├── README.md
└── package.json                  # Root orchestration package.json
```

---

## 4. Prerequisites

Ensure you have the following installed on your developer machine:

- **Node.js**: `v20.x` or higher (tested on `v24.x`)
- **npm**: `v10.x` or higher (tested on `v11.x`)
- **PostgreSQL**: Local PostgreSQL server (v14, v15, v16, or v17) running locally.

---

## 5. Local PostgreSQL Setup

YarnTrace uses a standard local PostgreSQL database.

### Step 1: Start PostgreSQL
Ensure your local PostgreSQL service is running. On Windows:
```powershell
# Verify service is running or start it via Services app / command line
net start postgresql-x64-16 # (or your specific PostgreSQL service name)
```

### Step 2: Create Database
Open your PostgreSQL CLI (`psql`) or a database tool (e.g. pgAdmin, DBeaver):
```sql
CREATE DATABASE yarntrace;
```

### Step 3: Configure Database Connection
Configure the connection string in `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/yarntrace?schema=public"
```

---

## 6. Environment Variables

### Backend (`backend/.env`):
Create `backend/.env` from `backend/.env.example`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:password@localhost:5432/yarntrace?schema=public"
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.local`):
Create `frontend/.env.local` from `frontend/.env.example`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 7. Installation & Running Instructions

### Step 1: Install Dependencies

```powershell
# Root level or in each folder:
cd backend
npm install

cd ../frontend
npm install
```

### Step 2: Prisma Database Setup

```powershell
cd backend
# Generate Prisma Client
npx prisma generate

# Run Migrations (when PostgreSQL is active)
npx prisma migrate dev --name init
```

### Step 3: Start the Backend Server

```powershell
cd backend
npm run start:dev
```
- API Base URL: `http://localhost:4000/api/v1`
- Health Check: `http://localhost:4000/api/v1/health`
- Swagger Documentation: `http://localhost:4000/api/docs`

### Step 4: Start the Frontend Application

In a new terminal:
```powershell
cd frontend
npm run dev
```
- Frontend Web App: `http://localhost:3000`

---

## 8. Development & Quality Commands

```powershell
# Build Verification
npm run build:backend
npm run build:frontend

# Linting
npm run lint:backend
npm run lint:frontend

# Unit & E2E Testing
npm run test:backend
```

---

## 9. API Documentation (Swagger)

When running the backend, interactive Swagger API documentation is accessible at:
👉 **`http://localhost:4000/api/docs`**

Swagger includes Bearer authentication support for testing secured endpoints directly from the browser.
