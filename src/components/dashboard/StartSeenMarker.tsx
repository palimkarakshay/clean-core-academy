"use client";

import { useEffect } from "react";
import { markStartSeen } from "@/lib/onboarding";

/** Records that the learner has reached the Start page (clears the
 *  first-visit redirect for subsequent home visits). Renders nothing. */
export function StartSeenMarker({ packId }: { packId: string }) {
  useEffect(() => {
    markStartSeen(packId);
  }, [packId]);
  return null;
}
