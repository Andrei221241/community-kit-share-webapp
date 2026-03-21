# Community Kit Share - Work Summary (2026-03-16)

## Branch and Scope
- Active branch: backend-raul
- Scope: Sprint 2 backend integration, routing, Pug views, Docker run/debug, schema loading, authentication wiring, and dependency cleanup.

## What we did today

### 1) Integrated teammates' recent work (without changing main)
- Pulled/cherry-picked latest commits from team branches onto backend-raul.
- Removed legacy file from old frontend branch that conflicted with Pug flow.

Where:
- views/pages/Member-Login-Page.html (removed)

### 2) Implemented Sprint 2 server-side pages using Express + Pug
- Reworked routing from static page serving to controller-based DB-backed rendering.
- Added users listing/profile, kit listing/detail, tags/categories, member requests, and coordinator pending/approve/reject flow.
- Added centralized error rendering for DB/query failures.

Where:
- app/app.js
- routes/index.js
- controllers/pages.controller.js
- views/layout.pug
- views/pages/users-list.pug
- views/pages/user-profile.pug
- views/pages/listings.pug
- views/pages/detail.pug
- views/pages/tags-categories.pug
- views/pages/member-requests.pug
- views/pages/member-confirmation.pug
- views/pages/coordinator-pending.pug
- views/pages/error.pug

### 3) Docker and database troubleshooting
- Fixed Docker build context issue caused by DB runtime files being copied into image context.
- Brought up web/db/phpMyAdmin containers.
- Diagnosed 500 errors as missing DB tables and loaded Sprint schema/seed data into sd2-db.

Where:
- .dockerignore
- db/schema/sprint2-schema.sql
- docker-compose.yml (used for run/debug)

### 4) Added authentication flow for demo login
- Added session middleware and user session propagation to templates.
- Added member/coordinator login POST handlers using bcrypt password check.
- Wired login directly to the database by querying the `users` table for `email`, `role`, and `password_hash`, then storing the authenticated user's id/name/role in session state for protected routes.
- Added route guards for member/coordinator protected pages and logout route.

Where:
- app/app.js
- routes/index.js
- controllers/pages.controller.js
- views/pages/member-login.pug
- views/pages/coordinator-login.pug
- views/layout.pug

### 5) Restored login page look to original design language
- Replaced temporary plain shared-layout login rendering with dedicated login layouts.
- Fixed background image paths in login CSS files.

Where:
- views/pages/member-login.pug
- views/pages/coordinator-login.pug
- public/styles/css/Member-Login-Page.css
- public/styles/css/Coordinator-login-Page.css

### 6) Cleaned dependencies to keep only necessary packages
- Removed unused direct dependencies that were inflating node_modules.
- Verified app still responds after cleanup.

Where:
- package.json
- package-lock.json

Removed:
- mysql
- sqlite3

Kept (required by current code):
- express
- pug
- mysql2
- dotenv
- express-session
- bcryptjs
- supervisor

## Validation performed
- Container status checks with docker-compose ps.
- Web logs inspection with docker-compose logs web.
- Endpoint checks:
  - GET /member/login -> 200
  - GET /coordinator/login -> 200
- Login checks:
  - POST /member/login with raul@example.com / password123 -> redirect /listings
  - POST /coordinator/login with karim@example.com / password123 -> redirect /coordinator/requests/pending

## Current state
- App and DB are running.
- Demo login works.
- Sprint pages are active and DB-backed.
- Login page styling is restored to the expected look.

Raul Pereira

======================== // ==========================
