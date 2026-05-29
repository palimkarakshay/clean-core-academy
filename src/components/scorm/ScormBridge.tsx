"use client";

import { useScormBridge } from "@/lib/scorm/useScormBridge";

/** Headless mount point for the SCORM↔progress bridge. Renders nothing. */
export function ScormBridge() {
  useScormBridge();
  return null;
}
