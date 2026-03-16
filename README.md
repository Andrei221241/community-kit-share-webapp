# Community Kit Share Web App (Sprint 2)

This sprint implements initial application features with **Express + Pug + MySQL**.
Database schema/content is owned by Karim and is **not modified** here.

## Implemented pages (DB-backed)

- `GET /users` → Users list page
- `GET /users/:id` → User profile page
- `GET /listings` → Listing page (search/filter by category/tag)
- `GET /listings/:id` → Detail page
- `GET /tags` → Tags/categories page

## User stories covered

- **US1** View kits list (name, category, short description, availability)
- **US2** Filter/search kits (category/tag/search + clear filters)
- **US3** View kit details (description, items, availability)
- **US4** Submit borrow request (`POST /requests`)
- **US5** Validate dates (end date cannot be before start date)
- **US6** View my requests/status (`GET /member/requests?userId={id}`)
- **US7** Coordinator view pending requests (`GET /coordinator/requests/pending`)
- **US8** Approve request (`POST /coordinator/requests/:id/approve`, with conflict check)
- **US9** Reject request (`POST /coordinator/requests/:id/reject`, optional reason)

## Expected DB tables (Karim schema)

The code expects these tables to exist and be populated:

- `users`
- `kits`
- `categories`
- `tags`
- `kit_tags`
- `kit_items`
- `borrow_requests`

## Run

```bash
npm install
npm run start
```

If running without Docker, ensure your `.env` points `DB_CONTAINER` to a reachable MySQL host.
In Docker Compose, `DB_CONTAINER=db` should resolve automatically.
