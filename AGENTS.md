# AGENTS.md

## Project structure

Two independent projects side-by-side (NOT a monorepo — no root `package.json`, no workspaces):

- **`client/`** — React 19 SPA, Vite 7, Tailwind CSS v4
- **`server/`** — Express 5 REST API, Mongoose 9, MongoDB Atlas

Each has its own `node_modules/`. Install and run commands from within each directory.

## Dev commands

```bash
# Client (from client/)
npm run dev      # Vite dev server on :5173
npm run build    # Production build to dist/
npm run lint     # ESLint

# Server (from server/)
npm run dev      # Nodemon on :5000
```

No test framework, no typecheck, no formatter configured anywhere.

## Tech quirks

- **Tailwind CSS v4**: Uses the `@tailwindcss/vite` plugin (NOT PostCSS). Config is in `vite.config.js`, not `tailwind.config.js`. Custom theme colors live in `client/src/theme/colors.js`.
- **Express 5** (not v4): Uses the v5 router and middleware signatures. CommonJS (`require()`) throughout server code.
- **React 19** with `react-router-dom` v7. Client routing is in `client/src/App.jsx` — all routes are defined there.
- **No TypeScript**: `@types/react` in devDependencies is a Vite template leftover, not actively used.
- **ESM in client, CJS in server**: Client uses `import`/`export` (ES modules). Server uses `require()` (CommonJS).

## API configuration

Client reads `VITE_API_URL` env var, defaults to `https://urbanwear-production.up.railway.app`. Defined in `client/src/config/api.js`. The client `.env` (`client/.env`) sets this to the production Railway URL.

Server CORS whitelist: `localhost:5173`, `urbanwearpk.store`, `www.urbanwearpk.store`. If you add a new frontend origin, update the `cors` config in `server/server.js:22`.

## Auth system

- Server-side: JWT issued on admin login. Two middleware layers: `jwt_token_middleware.js` (verifies token) → `admin_middleware.js` (checks `role === "admin"`).
- Client-side: JWT stored in `localStorage`. Parsed manually in `client/src/utils/auth.js` (no library). Route guards in `client/src/components/RouteGuards.jsx`.
- Admin credentials can be env-based (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) or database-backed — see `server/controllers/authController.js`.

## Image uploads

Multer uses `memoryStorage` (no disk writes). Files stream to **Cloudinary** via `streamifier`. 5MB limit, images only, max 5 per product. Upload middleware: `server/middleware/upload.js`. Cloudinary config: `server/config/cloudinary.js`.

## Cart

Client-side only — `useCart` hook (`client/src/hooks/useCart.js`) persists to `localStorage` under key `urbanwear_cart`. Cross-component updates use `window.dispatchEvent(new Event("cartUpdate"))`.

## Key routes (server)

| Prefix | Route file | Protected |
|--------|-----------|-----------|
| `/auth` | `auth_routes.js` | Partially |
| `/products` | `product_routes.js` | GET public, rest admin |
| `/orders` | `order_routes.js` | Admin |
| `/categories` | `category_routes.js` | GET public, rest admin |
| `/announcement` | `announcement_routes.js` | GET public |
| `/hero-slides` | `heroSlide_routes.js` | Admin |

Rate limiting: 100 req/15min per IP (applied only to `/auth` and `/products` via the limiter in `server.js`). Error handler middleware must remain last in `server.js`.

## Deployment

- **Client**: Vercel (SPA rewrites via `client/vercel.json`)
- **Server**: Railway
- **Domain**: urbanwearpk.store

## Gotchas

- `.env` files contain real credentials. The root `.gitignore` excludes `.env`, but verify these are not committed.
- Server `uploads/` directory exists but is unused (memory storage → Cloudinary).
- The `npm test` script in server is a stub — it just prints an error and exits 1.
- Route paths in `App.jsx` use inconsistent casing (`/OverSized_TShirts`, `/customise`). Match existing paths exactly when adding routes.
