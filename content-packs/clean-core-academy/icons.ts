/* SVG markup for the Clean Core Academy icons. A hexagonal "core"
   mark with a clean check, on a deep SAP-blue field. Inlined as a
   string so it can be served at /icon.svg + embedded in the PWA
   manifest without a separate asset request. Any 512×512 SVG works. */

export const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Clean Core Academy">
  <rect width="512" height="512" rx="96" fill="#0a2540"/>
  <polygon points="256,96 392,176 392,336 256,416 120,336 120,176"
           fill="none" stroke="#2ec4b6" stroke-width="22" stroke-linejoin="round"/>
  <path d="M196 258 l40 42 84 -96" fill="none" stroke="#5cd6c8"
        stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="256" y="468" text-anchor="middle"
        font-family="ui-monospace, 'SF Mono', monospace"
        font-weight="700" font-size="40" fill="#7fa6c9"
        letter-spacing="6">CLEAN CORE</text>
</svg>
`;

export const ICON_MASKABLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Clean Core Academy maskable">
  <rect width="512" height="512" fill="#0a2540"/>
  <g transform="translate(256 248) scale(0.62) translate(-256 -256)">
    <polygon points="256,96 392,176 392,336 256,416 120,336 120,176"
             fill="none" stroke="#2ec4b6" stroke-width="26" stroke-linejoin="round"/>
    <path d="M196 258 l40 42 84 -96" fill="none" stroke="#5cd6c8"
          stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;
