# Expected REST API contract

This app was converted from Firebase to axios. Point it at your backend by
setting `VITE_API_URL` in `.env` (see `.env.example`). All requests go
through `src/services/api.js`, which attaches `Authorization: Bearer <token>`
automatically once you're signed in.

Below is the contract `src/services/authService.js` and
`src/services/productService.js` expect. Adjust the service files if your
API differs.

## Auth (`authService.js`)

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/auth/signup` | `{ fullname, email, password }` | `{ user, token }` |
| POST | `/auth/signin` | `{ email, password }` | `{ user, token }` |
| POST | `/auth/signout` | – | 200 (best-effort) |
| GET  | `/auth/me` | – (auth'd) | `{ user }` |
| POST | `/auth/reset-password` | `{ email }` | 200 |
| PUT  | `/auth/password` | `{ currentPassword, newPassword }` | 200 |
| PUT  | `/auth/email` | `{ currentPassword, newEmail }` | 200 |
| PATCH | `/users/:id` | `{ ...fields }` | updated fields |
| PUT  | `/users/:id/basket` | `{ items }` | 200 |
| POST | `/uploads` | multipart: `image`, `folder` | `{ url }` |

`user` should include at least: `id`, `role` (`'USER'` \| `'ADMIN'`),
`fullname`, `email`, `avatar`, `banner`, `address`, `mobile`, `basket`.

## Products (`productService.js`)

| Method | Endpoint | Query/Body | Response |
|---|---|---|---|
| GET | `/products` | `?page=&limit=` | `{ products, total, nextPage }` |
| GET | `/products/:id` | – | product |
| GET | `/products/search` | `?q=` | `{ products, total }` |
| GET | `/products/featured` | `?limit=` | `{ products }` |
| GET | `/products/recommended` | `?limit=` | `{ products }` |
| POST | `/products` | multipart: fields + `image` + `imageCollection[]` | created product |
| PATCH | `/products/:id` | JSON, or multipart if images changed | updated product |
| DELETE | `/products/:id` | – | 200 |

`nextPage` should be `null`/falsy on the last page — the UI uses this to
know when to stop showing "Load more".

## Notes

- Auth is JWT-based and stored in `localStorage` (`src/services/api.js`).
  A 401 response clears the stored token automatically.
- Social login (Google/Facebook/GitHub) was removed along with Firebase;
  only email/password remains.
- Image uploads (avatar, banner, product photos) are sent as real files
  in multipart requests — your backend owns storage (S3, disk, etc.) and
  just needs to return a URL.
