#!/usr/bin/env node
/* ------------------------------------------------------------------
   Build a SCORM 1.2 package from the static export.

   Steps:
     1. Move export-incompatible routes aside: the /api handlers
        (force-dynamic) and the root page (uses redirect(), unsupported
        by `output: export`). The SCO launches the pack home directly.
     2. Run `SCORM_BUILD=1 NEXT_PUBLIC_SCORM=1 next build` → out/.
     3. Write imsmanifest.xml (SCORM 1.2) into out/.
     4. Zip out/ → dist/scorm/<pack>-scorm12.zip (system `zip`).
     5. Always restore the moved files.

   Verify the zip in an LMS (SCORM Cloud free tier works) before
   distributing — asset paths and iframe framing are LMS-dependent.
------------------------------------------------------------------ */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const PACK_ID = process.env.NEXT_PUBLIC_CONTENT_PACK_ID || "clean-core-academy";
const TITLE = "Clean Core Academy";

const outDir = path.join(root, "out");
const distDir = path.join(root, "dist", "scorm");

// Files moved aside during the export, restored in finally. These are
// either export-incompatible (force-dynamic / redirect) or irrelevant
// to a self-contained SCO (sitemap/robots/manifest are site-SEO files).
const moves = [
  { live: "src/app/api", parked: ".scorm-park/api" },
  { live: "src/app/page.tsx", parked: ".scorm-park/page.tsx" },
  { live: "src/app/robots.ts", parked: ".scorm-park/robots.ts" },
  { live: "src/app/sitemap.ts", parked: ".scorm-park/sitemap.ts" },
  { live: "src/app/manifest.ts", parked: ".scorm-park/manifest.ts" },
];

const log = (m) => console.log(`[build-scorm] ${m}`);

function parkFiles() {
  fs.mkdirSync(path.join(root, ".scorm-park"), { recursive: true });
  for (const m of moves) {
    const live = path.join(root, m.live);
    const parked = path.join(root, m.parked);
    if (fs.existsSync(live)) {
      fs.renameSync(live, parked);
      log(`parked ${m.live}`);
    }
  }
}

function restoreFiles() {
  for (const m of moves) {
    const live = path.join(root, m.live);
    const parked = path.join(root, m.parked);
    if (fs.existsSync(parked)) {
      fs.mkdirSync(path.dirname(live), { recursive: true });
      fs.renameSync(parked, live);
      log(`restored ${m.live}`);
    }
  }
  const park = path.join(root, ".scorm-park");
  if (fs.existsSync(park)) fs.rmSync(park, { recursive: true, force: true });
}

function manifest(launchHref) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="CCA-${PACK_ID}" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${TITLE}</title>
      <item identifier="ITEM-1" identifierref="RES-1" isvisible="true">
        <title>${TITLE}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="${launchHref}">
      <file href="${launchHref}"/>
    </resource>
  </resources>
</manifest>
`;
}

function main() {
  parkFiles();
  try {
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    log("building static export (this runs `next build` with output: export)…");
    execSync("next build", {
      stdio: "inherit",
      env: {
        ...process.env,
        SCORM_BUILD: "1",
        NEXT_PUBLIC_SCORM: "1",
        NEXT_PUBLIC_CONTENT_PACK_ID: PACK_ID,
      },
    });
  } finally {
    restoreFiles();
  }

  if (!fs.existsSync(outDir)) {
    throw new Error("static export did not produce out/");
  }

  // trailingSlash:true emits <pack>/index.html as the pack home.
  const launch = `${PACK_ID}/index.html`;
  if (!fs.existsSync(path.join(outDir, launch))) {
    throw new Error(`expected launch file out/${launch} not found`);
  }
  fs.writeFileSync(path.join(outDir, "imsmanifest.xml"), manifest(launch));
  log(`wrote imsmanifest.xml (launch: ${launch})`);

  fs.mkdirSync(distDir, { recursive: true });
  const zipPath = path.join(distDir, `${PACK_ID}-scorm12.zip`);
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  try {
    execSync(`cd "${outDir}" && zip -r -q -X "${zipPath}" .`, { stdio: "inherit" });
  } catch (e) {
    throw new Error(
      `zip failed — install the \`zip\` CLI (apt-get install zip). ${e.message}`
    );
  }
  log(`SCORM 1.2 package ready: ${path.relative(root, zipPath)}`);
}

try {
  main();
} catch (e) {
  console.error(`[build-scorm] ${e.message}`);
  process.exit(1);
}
