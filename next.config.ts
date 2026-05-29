import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

/**
 * Content-pack selection.
 *
 * The active pack is resolved at build time via the
 * `NEXT_PUBLIC_CONTENT_PACK_ID` environment variable. The webpack
 * alias `@active-pack` points at `content-packs/<id>/`, so the
 * import in `src/content/active-pack.ts` resolves to the selected
 * pack and tree-shaking eliminates inactive packs from the bundle.
 *
 * Default (no env var): `clean-core-academy` — the only pack this
 * single-course repo ships.
 *
 * Robustness: this repo used to host several packs and parallel Vercel
 * deploys keyed off `NEXT_PUBLIC_CONTENT_PACK_ID`. If a stale deploy
 * env var still points at a pack folder that no longer exists, fall
 * back to `clean-core-academy` rather than failing the build with an
 * unresolved `@active-pack` alias.
 */
const FALLBACK_PACK_ID = "clean-core-academy";
const REQUESTED_PACK_ID =
  process.env.NEXT_PUBLIC_CONTENT_PACK_ID || FALLBACK_PACK_ID;
const PACK_ID = fs.existsSync(
  path.resolve(__dirname, "content-packs", REQUESTED_PACK_ID)
)
  ? REQUESTED_PACK_ID
  : FALLBACK_PACK_ID;
if (PACK_ID !== REQUESTED_PACK_ID) {
  console.warn(
    `[next.config] content pack "${REQUESTED_PACK_ID}" not found under content-packs/ — falling back to "${FALLBACK_PACK_ID}".`
  );
}

/**
 * Strict-ish CSP baseline.
 *
 * - `'unsafe-inline'` on script-src is required because Next.js injects
 *   inline hydration scripts. Tightening to per-request nonces is a
 *   deferred follow-up (needs middleware).
 * - `connect-src` allows claude.ai for the Ask-AI hand-off; expand only
 *   when a pack ships an additional outbound destination.
 * - `frame-ancestors 'none'` blocks clickjacking.
 * - `object-src 'none'` blocks Flash / Java / pdf-plugin abuse.
 * - `upgrade-insecure-requests` forces http subresources to https.
 * - `'unsafe-eval'` is dev-only (Next's Fast Refresh evaluates strings);
 *   a production build never needs it, so it is dropped there to remove
 *   that XSS pivot.
 */
const isDev = process.env.NODE_ENV !== "production";

/**
 * SCORM packaging build. `SCORM_BUILD=1 NEXT_PUBLIC_SCORM=1 next build`
 * produces a static `out/` bundle that `scripts/build-scorm.mjs` wraps in
 * an imsmanifest.xml and zips. The normal Vercel/web build leaves
 * SCORM_BUILD unset and keeps the strict, frame-blocking baseline below;
 * ONLY the SCORM export relaxes framing so the SCO can render inside an
 * LMS iframe. This keeps the public site hardened against clickjacking.
 */
const SCORM_BUILD = process.env.SCORM_BUILD === "1";

/**
 * Opt-in: allow https LMS origins to iframe the LIVE web deploy. Needed
 * ONLY if you distribute the *embed* SCORM package (build:scorm:embed),
 * which frames this deployment rather than shipping its own assets. OFF
 * by default so the public site stays clickjacking-hardened
 * (frame-ancestors 'none' + X-Frame-Options DENY). The *self-contained*
 * SCORM package needs none of this — it ships its own assets and runs
 * fully inside the LMS iframe, so prefer it unless you specifically want
 * the embed variant, then set ALLOW_LMS_EMBED=1 on that deployment.
 */
const ALLOW_LMS_EMBED = process.env.ALLOW_LMS_EMBED === "1";
const ALLOW_FRAMING = SCORM_BUILD || ALLOW_LMS_EMBED;

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://claude.ai https://*.claude.ai",
  // Strict by default (blocks clickjacking on the public site). Only the
  // SCORM export, or an explicit ALLOW_LMS_EMBED opt-in, relaxes this so
  // the course can render inside an LMS iframe.
  ALLOW_FRAMING ? "frame-ancestors https:" : "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // DENY unless framing is allowed (SCORM export / ALLOW_LMS_EMBED), where
  // CSP frame-ancestors governs framing so the LMS can embed the SCO.
  ...(!ALLOW_FRAMING
    ? [{ key: "X-Frame-Options", value: "DENY" }]
    : []),
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  // @abaplint/core is a large Node library with internal dynamic
  // requires that don't survive webpack bundling — keep it external so
  // the /api/lint-abap serverless function `require()`s it at runtime.
  serverExternalPackages: ["@abaplint/core"],
  // SCORM export ships as a static bundle (no server): plain HTML/JS,
  // directory-style index.html files, and root-relative asset URLs so the
  // package works at any LMS path. Inert on the normal web build.
  ...(SCORM_BUILD
    ? { output: "export" as const, trailingSlash: true, assetPrefix: "." }
    : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    // Module thumbnails + the landing hero are generated on demand by
    // Pollinations AI (see content-packs/clean-core-academy/module-images.ts).
    // The CSP img-src already allows https: sources.
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" },
    ],
    // No image-optimization server exists in a static export.
    ...(SCORM_BUILD ? { unoptimized: true } : {}),
  },
  // Subresource Integrity was previously enabled via experimental.sri.
  // On Vercel the integrity attribute on the initial <script> chunks did
  // not match the bytes served from the CDN (likely compression-layer
  // differences vs. the build-time hash), so the browser blocked at
  // least one of those scripts, React never hydrated, and every
  // client-side interaction was inert — tabs didn't switch, the theme
  // toggle didn't flip. Disable until per-request CSP nonces land (the
  // tracked alternative in SECURITY.md). Re-enable only after a
  // matching-bytes verification step in CI.
  async headers() {
    // Static export emits no server to send headers, and the LMS frames
    // the SCO — so skip them entirely for the SCORM build.
    if (SCORM_BUILD) return [];
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@active-pack": path.resolve(__dirname, `./content-packs/${PACK_ID}`),
    };
    return config;
  },
  // Turbopack uses a different config key but accepts the same alias shape.
  turbopack: {
    resolveAlias: {
      "@active-pack": `./content-packs/${PACK_ID}`,
    },
  },
};

export default nextConfig;
