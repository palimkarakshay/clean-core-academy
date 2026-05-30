#!/usr/bin/env node
/* ------------------------------------------------------------------
   Build an "embed" SCORM 1.2 package.

   Instead of bundling the whole Next app (which can't navigate at an
   arbitrary LMS path), this produces a tiny SCO whose index.html loads
   the LIVE deployment in a full-screen iframe. The course then renders
   and navigates exactly as it does on the web, and the wrapper reports
   completion to the LMS via the SCORM API.

   Requirements for it to work in the LMS:
     - The embedded URL is publicly reachable from the learner's browser.
     - That deployment allows framing (CSP frame-ancestors https:) — set
       in next.config.ts, so it must be deployed there.

   Configure the target with EMBED_URL (defaults to production).
------------------------------------------------------------------ */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const TITLE = "Clean Core Academy";
const EMBED_URL =
  process.env.EMBED_URL || "https://clean-core-academy.vercel.app/clean-core-academy";

const buildDir = path.join(root, ".scorm-embed-build");
const distDir = path.join(root, "dist", "scorm");
const zipPath = path.join(distDir, "clean-core-academy-embed-scorm12.zip");

const log = (m) => console.log(`[build-scorm-embed] ${m}`);

function indexHtml(url) {
  // The inline script walks the frame chain for the SCORM API (1.2 or
  // 2004), marks the SCO complete, and finishes on unload. JSON.stringify
  // safely injects the URL.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${TITLE}</title>
<style>
  html, body { margin: 0; padding: 0; height: 100%; background: #f4f8fb; }
  iframe { border: 0; width: 100%; height: 100%; display: block; }
  .fallback { font-family: system-ui, sans-serif; padding: 24px; color: #0a2540; }
</style>
<script>
(function () {
  function find(w) {
    var i = 0;
    while (w && i < 12) {
      if (w.API_1484_11) return { v: "2004", a: w.API_1484_11 };
      if (w.API) return { v: "1.2", a: w.API };
      if (w.parent === w) break;
      w = w.parent; i++;
    }
    return null;
  }
  var f = find(window) || (window.opener ? find(window.opener) : null);
  if (!f) return;
  try {
    if (f.v === "2004") {
      f.a.Initialize("");
      f.a.SetValue("cmi.completion_status", "completed");
      f.a.SetValue("cmi.success_status", "passed");
      f.a.Commit("");
    } else {
      f.a.LMSInitialize("");
      f.a.LMSSetValue("cmi.core.lesson_status", "completed");
      f.a.LMSCommit("");
    }
  } catch (e) {}
  function term() {
    try {
      if (f.v === "2004") { f.a.Commit(""); f.a.Terminate(""); }
      else { f.a.LMSCommit(""); f.a.LMSFinish(""); }
    } catch (e) {}
  }
  window.addEventListener("pagehide", term);
  window.addEventListener("beforeunload", term);
})();
</script>
</head>
<body>
<iframe src=${JSON.stringify(url)} title=${JSON.stringify(TITLE)}
  allow="fullscreen" allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"></iframe>
<noscript><p class="fallback">This course requires JavaScript and access to
${url}</p></noscript>
</body>
</html>
`;
}

function manifest() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="CCA-embed" version="1.2"
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
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>
`;
}

function main() {
  fs.rmSync(buildDir, { recursive: true, force: true });
  fs.mkdirSync(buildDir, { recursive: true });
  fs.writeFileSync(path.join(buildDir, "index.html"), indexHtml(EMBED_URL));
  fs.writeFileSync(path.join(buildDir, "imsmanifest.xml"), manifest());
  log(`wrapping embedded URL: ${EMBED_URL}`);

  fs.mkdirSync(distDir, { recursive: true });
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  try {
    execSync(`cd "${buildDir}" && zip -r -q -X "${zipPath}" .`, { stdio: "inherit" });
  } catch (e) {
    throw new Error(`zip failed — install the \`zip\` CLI. ${e.message}`);
  }
  fs.rmSync(buildDir, { recursive: true, force: true });
  const kb = (fs.statSync(zipPath).size / 1024).toFixed(1);
  log(`embed SCORM 1.2 package ready: ${path.relative(root, zipPath)} (${kb} KB)`);
}

try {
  main();
} catch (e) {
  console.error(`[build-scorm-embed] ${e.message}`);
  process.exit(1);
}
