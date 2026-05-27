"use client";

import { useEffect } from "react";
import { usePack } from "@/content/pack-context";
import { getProgressStore } from "@/lib/progress-store";
import { computeScormSummary } from "./summary";
import {
  scormCommit,
  scormInit,
  scormSetProgress,
  scormTerminate,
} from "./runtime";

/**
 * Wires the local progress store to the LMS. On mount it initializes
 * the SCORM session (no-op when not inside an LMS), pushes the current
 * score/status, then re-pushes on every progress change and commits on
 * page hide / unload. Gated on NEXT_PUBLIC_SCORM so it never runs on
 * the normal web deploy.
 */
export function useScormBridge(): void {
  const pack = usePack();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SCORM !== "1") return;
    if (!scormInit()) return;

    const store = getProgressStore(pack.config.id);
    const sectionIds = pack.curriculum.sections.map((s) => s.id);

    const push = () => {
      const summary = computeScormSummary(store.get(), sectionIds);
      scormSetProgress({
        status: summary.status,
        scoreRaw: summary.scoreRaw,
        suspendData: JSON.stringify({
          v: 1,
          passed: summary.passedSections,
          total: summary.totalSections,
        }),
      });
      scormCommit();
    };

    push();
    const unsubscribe = store.subscribe(push);
    const onHide = () => scormCommit();
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", scormTerminate);

    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", scormTerminate);
      scormTerminate();
    };
  }, [pack]);
}
