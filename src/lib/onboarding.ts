/* ------------------------------------------------------------------
   First-visit onboarding flag (per pack).

   There is no login; "has the learner seen the Start page before" is a
   single localStorage flag. The home page redirects first-time visitors
   to /[packId]/start; visiting Start sets the flag so later home visits
   load straight through. On storage error we treat the user as
   already-onboarded, so a storage-less context never traps them in a
   redirect loop.
------------------------------------------------------------------ */

const key = (packId: string) => `${packId}:onboarded:v1`;

export function hasSeenStart(packId: string): boolean {
  try {
    return localStorage.getItem(key(packId)) === "1";
  } catch {
    return true;
  }
}

export function markStartSeen(packId: string): void {
  try {
    localStorage.setItem(key(packId), "1");
  } catch {
    /* storage unavailable — ignore */
  }
}
