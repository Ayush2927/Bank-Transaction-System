# Ledger: Production-Grade Fintech Platform

![CI Pipeline](https://github.com/Ayush2927/Bank-Transaction-System/actions/workflows/ci.yml/badge.svg)

A full-stack banking and ledger application built with the MERN stack (MongoDB, Express, React, Node.js). This project is designed to emulate the architecture, security, and user experience of a modern fintech platform (like Mercury, Stripe, or Revolut).

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Shadcn UI, React Query, Recharts, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB, Mongoose.
- **Security:** JWT Authentication, bcrypt, native MongoDB Transactions (ACID compliance).

## Phase 1: Core Foundation (Completed)

- **Authentication System:** Secure registration and login flows using JWT.
- **Account Management:** Users can create and manage multiple sub-accounts (e.g., Checking, Savings) with real-time balances.
- **Ledger Transfers:** Users can transfer funds between accounts or to other users. 
- **ACID Compliance:** All transfers utilize native MongoDB Transactions `session.withTransaction()` to ensure that if a server crashes midway through a transfer, the database state perfectly rolls back, preventing lost money.
- **Premium UI:** A fully responsive, dark-mode compatible dashboard featuring a quiet, data-dense, and highly professional aesthetic.

---

## Master Roadmap

The following phases outline the upcoming development sprints to upgrade this application from an MVP to a bulletproof, feature-rich enterprise platform.

### Phase 2: Technical & Security Hardening (Backend Focus)

These infrastructure upgrades ensure the platform can survive bad actors, race conditions, and network failures.

1. **Optimistic Concurrency Control (OCC):** Fixing the "Double Spend" vulnerability by strictly verifying document versions/balances mid-transaction to mathematically prevent overdrafts during concurrent requests.
2. **Idempotency Keys:** Requiring an `Idempotency-Key` header for transfers to ensure that if a user's network drops and they retry the request, they don't accidentally send money twice.
3. **API Rate Limiting & Velocity Checks:** Implementing `express-rate-limit` to prevent brute-force login attacks and capping maximum transfer volumes per 24 hours.
4. **Token Blacklisting (Secure Logout):** Implementing a Redis (or MongoDB) token blacklist so that clicking "Sign Out" instantly invalidates the JWT cryptographically.
5. **Database Pagination:** Upgrading the `GET /transactions` endpoint to use cursor-based pagination, ensuring the app remains performant even when a user has 50,000 transactions.

### Phase 3: Premium Product Features

Once the foundation is bulletproof, we will build out modern fintech user features.

1. **Saved Contacts (Address Book):** Allowing users to save frequently used 24-character Account IDs to a "Contacts" list for easy 1-click transfers.
2. **Virtual Debit Cards:** A system allowing users to generate, view, and freeze 16-digit virtual debit cards linked to their specific checking accounts.
3. **Savings Vaults & Goals:** Allowing users to spin up temporary "Vaults" to set aside money for specific goals (e.g., "New Car") outside of their main spending balance.
4. **Transaction Analytics:** Adding a `category` system to transactions and building a backend aggregation pipeline to serve a spending breakdown (Pie Chart) to the dashboard.
5. **Scheduled & Recurring Transfers:** Implementing a Node-Cron background worker to process automated transfers (e.g., "Move $50 to Savings every Friday").
6. **Two-Factor Authentication (2FA):** Securing high-value transfers and logins by requiring a 6-digit OTP code via an Authenticator App.

---

## Running Locally

1. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Environment Variables Needed:**
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
