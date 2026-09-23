# YarnTrace Authentication & Authorization Architecture

## 1. Authentication Strategy

YarnTrace implements a secure, stateless dual-token architecture using **JSON Web Tokens (JWT)** and **Bcrypt / Argon2** password hashing.

> [!IMPORTANT]
> YarnTrace explicitly uses internal JWT authentication and does NOT use Firebase Authentication or any third-party auth provider.

---

## 2. Token Lifecycle & Specifications

| Token Type | Lifespan | Stored Location | Purpose | Signature / Payload |
|---|---|---|---|---|
| **Access Token** | 15 Minutes (`JWT_ACCESS_EXPIRES_IN`) | Authorization Header (`Bearer`) / In-Memory State | API resource authorization | User ID, Email, Role, Granted Permissions |
| **Refresh Token** | 7 Days (`JWT_REFRESH_EXPIRES_IN`) | HttpOnly Cookie / Secure Storage | Generating new access tokens | User ID, Token Family / Hash ID |

---

## 3. Authentication Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant FE as Next.js Frontend
    participant API as NestJS Backend (/api/v1/auth)
    participant DB as PostgreSQL (Prisma)

    %% Login Flow
    User->>FE: Enter Email & Password
    FE->>API: POST /api/v1/auth/login { email, password }
    API->>DB: Find User with Roles & Permissions
    API->>API: Verify Password Hash (Bcrypt)
    API->>API: Issue AccessToken (15m) & RefreshToken (7d)
    API->>DB: Store hashed RefreshToken for rotation
    API-->>FE: Return { success: true, data: { user, accessToken, refreshToken } }
    FE->>FE: Save tokens & initialize Redux auth state

    %% Protected API Call
    User->>FE: Navigate to /inventory
    FE->>API: GET /api/v1/inventory (Header: Bearer AccessToken)
    API->>API: Verify JWT signature & expiration
    API-->>FE: 200 OK + Inventory Data

    %% Token Refresh Cycle on 401
    Note over FE,API: When AccessToken expires (401 Response)
    FE->>API: POST /api/v1/auth/refresh { refreshToken }
    API->>DB: Validate RefreshToken against active session
    API->>API: Generate new AccessToken & rotated RefreshToken
    API->>DB: Update stored RefreshToken hash
    API-->>FE: Return new token pair
    FE->>API: Re-try initial failed request automatically
```

---

## 4. Security Principles & Hardening

1. **Password Hashing**: Passwords are never stored in plain text. Hashed using Bcrypt with standard salt rounds (10+) or Argon2id.
2. **Token Invalidation**: Logout requests invalidate the refresh token in the database, preventing token reuse.
3. **No Sensitive Data in State**: Password hashes and refresh token secrets are stripped from responses and never stored in client-side Redux.
4. **CORS & Rate Limiting**: Backend limits unauthorized endpoint abuse and restricts cross-origin calls to verified origins.
