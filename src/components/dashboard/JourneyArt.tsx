/**
 * Decorative "forward journey" mark — a soft horizon, a rising sun, and a
 * dashed path with a forward arrow. Static inline SVG (no client needed),
 * recoloured to the pack theme tokens so it adapts to light/dark.
 * Adapted from the uploaded CHTSplus "cfb-art" motif.
 */
export function JourneyArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* horizon */}
      <path
        d="M0 60 Q 30 50 60 55 T 120 50"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1.2"
      />
      {/* sun */}
      <circle
        cx="78"
        cy="34"
        r="9"
        fill="var(--accent)"
        fillOpacity="0.12"
        stroke="var(--accent)"
        strokeWidth="1"
      />
      {/* sun rays */}
      <path
        d="M78 22v-4M78 50v-2M64 34h-3M92 34h3M68 24l-2-2M88 24l2-2"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* dashed path forward */}
      <path
        d="M10 70 h80"
        stroke="var(--border)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* arrow head */}
      <path
        d="m90 70 -4 -3 m4 3 -4 3"
        stroke="var(--accent-2)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
