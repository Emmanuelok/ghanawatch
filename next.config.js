/** @type {import('next').NextConfig} */

// Map tile hosts — must match components/maplibre-map.tsx + app/parcel-draw/draw-map.tsx.
const TILE_HOSTS = "https://*.basemaps.cartocdn.com https://server.arcgisonline.com";

// Static, build-time CSP (compatible with Next's prerendered pages).
// 'unsafe-inline' on script-src is required because Next streams its RSC payload
// via inline <script> bootstraps that carry no nonce on static pages — a strict
// nonce/'strict-dynamic' policy breaks static rendering (verified empirically).
// This policy still blocks ALL third-party script origins, framing, plugins, and
// base-tag hijacking — the bulk of the XSS/clickjacking blast radius. Upgrading to
// a strict nonce CSP would require forcing dynamic rendering app-wide.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${TILE_HOSTS}`,
  `connect-src 'self' ${TILE_HOSTS}`,
  "worker-src 'self' blob:",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(self), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
