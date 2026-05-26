/* ------------------------------------------------------------------
   Base path for the academy when it is mounted as a multi-zone under
   another site (e.g. lumivara.ca/academy). Next applies `basePath`
   automatically to next/link, next/navigation, next/image and route
   handlers — but NOT to hand-written `fetch("/api/…")` calls or to
   absolute URLs inside the Metadata / manifest objects. Use this
   constant in those places so they resolve under the prefix too.

   Sourced from NEXT_PUBLIC_BASE_PATH (set in next.config.ts) so it
   stays in lockstep with the configured basePath.
------------------------------------------------------------------ */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an app-absolute path (e.g. "/api/lint-abap") with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
