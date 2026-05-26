"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasSeenStart } from "@/lib/onboarding";

/**
 * Sends first-time visitors to the Start page. Renders nothing; the
 * check runs after hydration (localStorage is client-only), and visiting
 * Start sets the flag so this never fires again.
 */
export function FirstVisitGate({ packId }: { packId: string }) {
  const router = useRouter();
  useEffect(() => {
    if (!hasSeenStart(packId)) {
      router.replace(`/${packId}/start`);
    }
  }, [packId, router]);
  return null;
}
