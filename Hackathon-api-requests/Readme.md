# Hackathon API Requests

Bruno collection for testing the GlobeTrotter backend.

## What this is

These `.yml` files are request definitions for the [Bruno](https://www.usebruno.com/) API testing tool. Open this folder as a collection in Bruno to run requests against a locally running backend (`http://localhost:5000`).

## Bearer tokens

The bearer tokens embedded in these files are **test tokens only** — issued locally with the dev `JWT_SECRET` for the seeded test user (`test@example.com`). They are not production credentials and will expire (7-day lifetime). If a request starts returning `401`, sign in via `login user.yml` (or `signup user.yml`) and paste a fresh token into the `auth.token` field.

## Notes

- Some requests are destructive (`trip delete`, `delete stop`, `delete stop activity`, `delete me`). Run them against throwaway data or recreate data first with the `* post` / `add *` requests.
- `signup user.yml` uses a fixed email; a second run returns `409`. Change the email to re-run it.
- The collection requires the backend to be running:
  ```bash
  cd backend
  npm install
  node index.js
  ```
