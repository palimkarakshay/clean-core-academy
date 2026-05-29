"use client";

import { useEffect } from "react";
import { usePack } from "@/content/pack-context";
import { getProgressStore } from "@/lib/progress-store";
import { computeScormSummary } from "./summary";
import { deserializeProgress, serializeProgress } from "./persist";
import { setLearnerName } from "./identity";
import {
  scormCommit,
  scormGetLearner,
  scormGetSuspendData,
  scormInit,
  scormSetBookmark,
  scormSetProgress,
  scormSuspend,
  scormTerminate,
} from "./runtime";

/** SCORM 1.2 student_name is usually "Last, First" — show "First Last". */
function displayName(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";
  const comma = s.indexOf(",");
  if (comma > 0) {
    const lastName = s.slice(0, comma).trim();
    const firstName = s.slice(comma + 1).trim();
    if (firstName && lastName) return `${firstName} ${lastName}`;
  }
  return s;
}

/**
 * Wires the local progress store to the LMS. On mount it initializes the
 * SCORM session (no-op when not inside an LMS), reads the learner name,
 * RESTORES prior progress from the LMS's suspend_data (so completed
 * modules, scores, mastery and the open module all return on any device),
 * then re-pushes score/completion/suspend_data + a lesson_location
 * bookmark on every change. On page hide it suspends; on unload it
 * terminates (also suspending) so the next launch resumes. Gated on
 * NEXT_PUBLIC_SCORM so it never runs on the normal web deploy.
 */
export function useScormBridge(): void {
  const pack = usePack();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SCORM !== "1") return;
    if (!scormInit()) return;

    const store = getProgressStore(pack.config.id);
    const sectionIds = pack.curriculum.sections.map((s) => s.id);
    const firstId = sectionIds[0];

    // Who the LMS launched this for (LMS owns the assignment itself).
    setLearnerName(displayName(scormGetLearner().name));

    // Resume: rehydrate the store from suspend_data before the first push
    // so we never clobber saved state with an empty slate.
    const restored = deserializeProgress(scormGetSuspendData(), firstId);
    if (restored) store.hydrate(restored);

    const push = () => {
      const progress = store.get();
      const summary = computeScormSummary(progress, sectionIds);
      scormSetProgress({
        status: summary.status,
        scoreRaw: summary.scoreRaw,
        suspendData: serializeProgress(progress),
      });
      scormSetBookmark(progress.location?.sectionId ?? "");
      scormCommit();
    };

    push();
    const unsubscribe = store.subscribe(push);
    const onHide = () => scormSuspend();
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
