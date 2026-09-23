# YarnTrace System Architecture

## 1. High-Level Architecture Overview

YarnTrace is built as an enterprise-grade, decoupled web application engineered for complete end-to-end yarn inventory and production traceability.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                                                                                   |
|   Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS                  |
|   Stitch Design System ("Industrial Loom & Trace" - Light Orange / Amber Theme)  |
|   State: Redux Toolkit (Session & UI) | TanStack Query (Server Cache)             |
|   HTTP: Axios (JWT interceptors & automatic token refresh)                        |
+------------------------------------------+----------------------------------------+
                                           |
                                           | HTTPS / REST JSON API
                                           | (Base: /api/v1)
                                           v
+-----------------------------------------------------------------------------------+
|                                 BACKEND TIER                                      |
|                                                                                   |
|   NestJS Application (Node.js + TypeScript)                                       |
|   - Modular Architecture (Auth, Users, Inventory, Production, Traceability, etc.)|
|   - Global Interceptors (Transform), Filters (HttpException), ValidationPipes    |
|   - Security: Helmet, CORS, Argon2/Bcrypt, Rate Limiting                          |
|   - Swagger OpenAPI Documentation (/api/docs)                                     |
+------------------------------------------+----------------------------------------+
                                           |
                                           | Prisma Client ORM
                                           | Connection Pool
                                           v
+-----------------------------------------------------------------------------------+
|                                DATABASE TIER                                      |
|                                                                                   |
|   PostgreSQL Database (Local dev / Managed cloud)                                 |
|   - 17 Initial Core Relational Entities                                          |
|   - Exact Decimal(12, 4) Precision for all KG Quantities                          |
|   - Comprehensive Audit Logging & Strict Foreign Key Integrity                   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture (Next.js 15 App Router)

- **Framework**: Next.js 15 with React 19 and TypeScript.
- **Routing**: Next.js App Router (`src/app/`). Clean separation between layout shells and domain route views.
- **Design System ("Industrial Loom & Trace")**:
  - Warm light orange / amber primary accents (`#ea580c`, `#f97316`, `#fff7ed`).
  - Crisp white container surfaces (`#ffffff`) floating on subtle light canvas (`#f8fafc` / `#f8f9ff`).
  - Strict 8pt structural grid, 8px radius system, and hairline border separators (`#e2e8f0`).
  - High-density tabular typography using Inter with OpenType tabular lining figures (`tnum`) for accurate numeric comparisons across yarn lots and kilograms.
- **State Management Layer**:
  - **Redux Toolkit**: Manages synchronous client state (authenticated user, token status, permissions matrix, collapsible sidebar state, global dialogs/notifications).
  - **TanStack Query (React Query)**: Manages asynchronous server state caching, background invalidation, optimistic updates, and query de-duplication.
- **API Client Layer (`src/lib/axios.ts`)**:
  - Centralized Axios instance with `NEXT_PUBLIC_API_URL`.
  - Automatic `Authorization: Bearer <accessToken>` header injection.
  - Automatic token refresh on `401 Unauthorized` responses with an in-flight request queue to avoid duplicate refresh calls.

---

## 3. Backend Architecture (NestJS REST API)

- **Framework**: NestJS standard modular structure.
- **API Versioning & Prefixing**: Global prefix `/api/v1`.
- **Controllers**: Thin controllers strictly handling HTTP request validation, parameter mapping, and delegating to services.
- **Services**: Encapsulate all business logic and database interactions via `PrismaService`.
- **Data Transfer Objects (DTOs)**: Enforce strong request typing using `class-validator` and `class-transformer` with a global `ValidationPipe` (`whitelist: true, forbidNonWhitelisted: true, transform: true`).
- **Standardized Response Envelope**:
  - Success Response:
    ```json
    {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
    ```
  - Error Response:
    ```json
    {
      "success": false,
      "message": "Validation failed",
      "errors": ["lotNumber must be a string", "quantity must be a positive number"]
    }
    ```
- **Global Error Handling**: `AllExceptionsFilter` intercepts unhandled exceptions, logs sanitized errors internally, and prevents internal stack trace leaks.

---

## 4. Security & Compliance

- **Authentication**: Stateless JSON Web Tokens (JWT) using asymmetric or HMAC-SHA256 signing. Short-lived Access Tokens (15m) + Long-lived Refresh Tokens (7d) stored securely.
- **Role-Based & Permission-Based Access Control**: Reusable `@RequirePermission(...)` and `@Roles(...)` decorators with `PermissionsGuard` and `RolesGuard`.
- **Database Safety**: Prisma ORM with parameterized queries protects against SQL injection attacks.
- **Audit Logging**: Every state mutation is captured in `AuditLog` records containing `userId`, `action`, `module`, `entityType`, `entityId`, `oldValue`, `newValue`, `ipAddress`, and `metadata`.
