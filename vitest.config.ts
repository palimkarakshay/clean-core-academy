import { defineConfig } from "vitest/config";
import path from "path";
import fs from "fs";

// Mirror next.config.ts: fall back to the only pack if a stale env var
// points at a pack folder that no longer exists.
const FALLBACK_PACK_ID = "clean-core-academy";
const REQUESTED_PACK_ID =
  process.env.NEXT_PUBLIC_CONTENT_PACK_ID || FALLBACK_PACK_ID;
const PACK_ID = fs.existsSync(
  path.resolve(__dirname, "content-packs", REQUESTED_PACK_ID)
)
  ? REQUESTED_PACK_ID
  : FALLBACK_PACK_ID;

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.ts", "src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@active-pack": path.resolve(__dirname, `./content-packs/${PACK_ID}`),
      // `server-only` is a Next.js build-time guard that throws when
      // imported into a client bundle. Vitest treats files as client
      // by default, so resolve the import to an empty shim — the
      // boundary it enforces is irrelevant in unit tests.
      "server-only": path.resolve(__dirname, "./test/server-only-shim.ts"),
    },
  },
});
