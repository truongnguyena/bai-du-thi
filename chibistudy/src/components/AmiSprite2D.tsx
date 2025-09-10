export default function AmiSprite2D() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="ami-float"
    >
      <defs>
        <radialGradient id="hair2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 16) rotate(90) scale(20)">
          <stop offset="0" stopColor="#FFFFFF"/>
          <stop offset="1" stopColor="#EDE9FE"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#FFF0F5" stroke="#FFC8DB" />
      {/* hair */}
      <circle cx="32" cy="28" r="12" fill="url(#hair2)"/>
      {/* eyes */}
      <g className="ami-eyes">
        <ellipse cx="24" cy="30" rx="3" ry="4" fill="#FF6B6B"/>
        <ellipse cx="40" cy="30" rx="3" ry="4" fill="#FF6B6B"/>
        <circle cx="24" cy="30" r="1.2" fill="#FFF"/>
        <circle cx="40" cy="30" r="1.2" fill="#FFF"/>
      </g>
      {/* eyelids (blink) */}
      <g className="ami-eyelids">
        <rect x="21" y="26" width="6" height="8" fill="#FFF0F5" rx="3"/>
        <rect x="37" y="26" width="6" height="8" fill="#FFF0F5" rx="3"/>
      </g>
      {/* smile */}
      <path d="M22 38 C 26 42, 38 42, 42 38" stroke="#FF8FB3" strokeWidth="2" fill="none"/>
      {/* maid collar */}
      <g className="ami-hand">
        <rect x="20" y="42" width="24" height="10" rx="5" fill="#FFD1E1" stroke="#FFB6C1"/>
        <path d="M24 44 h16 v2 H24 z" fill="#FFFFFF" opacity="0.9"/>
      </g>
      {/* sparkles */}
      <g className="ami-sparkles">
        <circle cx="14" cy="14" r="1.5" fill="#FFB6C1" />
        <circle cx="52" cy="18" r="1.2" fill="#FF8FB3" />
        <circle cx="50" cy="48" r="1.4" fill="#FFC8DB" />
      </g>
    </svg>
  )
}

