/**
 * Lumivara Forge mark — a clean-core hexagon with a light-spark "forged"
 * at its centre (lumi = light, forge = craft). Static inline SVG using
 * the brand theme tokens (navy/teal core, a gold ember), so it adapts to
 * light/dark and never ships a raster asset.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* clean-core hexagon */}
      <path
        d="M16 2.5 L27.5 9.25 V22.75 L16 29.5 L4.5 22.75 V9.25 Z"
        fill="var(--accent)"
        fillOpacity="0.10"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* light spark forged at the core */}
      <path
        d="M16 8 L17.7 14.3 L24 16 L17.7 17.7 L16 24 L14.3 17.7 L8 16 L14.3 14.3 Z"
        fill="var(--accent-2)"
      />
      {/* ember */}
      <circle cx="16" cy="16" r="1.7" fill="var(--warn)" />
    </svg>
  );
}
