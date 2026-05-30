# Security posture — GhanaWatch

This documents what is hardened today and the known gaps. GhanaWatch is currently
a **functional prototype with mock data** — there is no real authentication,
database, or money movement yet. Treat the items under "Known gaps" as the
prerequisites before any real user or real funds.

## In place

### HTTP headers (`next.config.js`)
Applied to every route:
- **Content-Security-Policy** — `default-src 'self'`; third-party **scripts blocked**
  (only `'self'` + inline Next bootstrap), framing locked to same-origin,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. Map tile hosts
  (`*.basemaps.cartocdn.com`, `server.arcgisonline.com`) are explicitly allow-listed
  for `img-src`/`connect-src`, and `worker-src 'self' blob:` permits MapLibre's
  web worker.
  - *Constraint:* `script-src` includes `'unsafe-inline'` because Next streams its
    RSC payload via nonce-less inline `<script>` on statically-prerendered pages.
    A strict nonce/`'strict-dynamic'` policy was tested and **breaks static
    rendering** (blocks Next's own chunks). Upgrading would require forcing dynamic
    rendering app-wide. The current policy still removes the cross-origin-script and
    clickjacking blast radius, which is the dominant XSS risk.
- **Strict-Transport-Security** (2y, preload), **X-Content-Type-Options: nosniff**,
  **X-Frame-Options: SAMEORIGIN**, **Referrer-Policy: strict-origin-when-cross-origin**,
  **Permissions-Policy** (mic off, payment off), `X-Powered-By` removed.

### API routes (`lib/api-guard.ts`)
All six AI endpoints (`verify-document`, `photo-vision`, `investigator`,
`investigator-stream`, `dossier`, `project-health`):
- **Rate limited** per-IP per-route. Uses **Upstash Redis** when
  `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set (global, durable),
  with an in-memory fallback otherwise. Returns **429 + `Retry-After`**.
- **Payload caps** — oversized bodies rejected with **413** (by `Content-Length`
  and actual byte length) before any parse or model call.
- **Image validation** — base64 data-URLs must match an allow-list of media types
  (jpeg/png/gif/webp) and a 6 MB ceiling; anything else is `400`.
- **Input clamping** — strings truncated, chat history capped to 20 turns / 6k
  chars per message, IDs length-bounded. Nothing unvalidated reaches the model.
- **Secrets server-side only** — `ANTHROPIC_API_KEY` is read in route handlers and
  never shipped to the client. All routes degrade to a deterministic offline mode
  when the key is absent.

### Reliability
- Route + root error boundaries (`app/error.tsx`, `app/global-error.tsx`), route
  loading skeleton (`app/loading.tsx`), custom 404.
- Deterministic rendering — fixed a hydration mismatch (random invite token) and a
  non-deterministic "sealed" evidence-pack hash.

## Known gaps (before production)

| Priority | Gap |
|---|---|
| **P0** | **No authentication / authorization.** Owner surfaces (`/dashboard`, `/settings`, `/projects/*`) are world-readable. Add Clerk / Auth.js + role-based access. |
| **P0** | **No database.** All data is in-memory mock (`lib/mock-data.ts`). |
| **P0** | **No real payments / escrow.** Funding + escrow flows are simulated. |
| **P1** | CSP allows `'unsafe-inline'` scripts (Next static constraint, above). |
| **P1** | No automated tests / CI gate. |
| **P2** | No real observability (the Sentinel SOC page is illustrative). |
| **P2** | Markdown rendered via `dangerouslySetInnerHTML` with manual escaping — safe today, but `react-markdown` would be defence-in-depth. |

## Reporting

Until a formal program exists, report security issues privately to the maintainer.
Do not open public issues for vulnerabilities.
