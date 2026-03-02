"use client";

/**
 * Cyberpunk holographic avatar — animated SVG with glitch,
 * scan lines, circuit traces, and emerald glow effects.
 */
export function CyberAvatar({ size = 128 }: { size?: number }) {
  const r = size / 2;
  const id = "cyber-av";

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 128 128"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
      >
        <defs>
          {/* Radial glow behind head */}
          <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Clip circle */}
          <clipPath id={`${id}-clip`}>
            <circle cx="64" cy="64" r="62" />
          </clipPath>

          {/* Scan line pattern */}
          <pattern id={`${id}-scan`} width="128" height="4" patternUnits="userSpaceOnUse">
            <rect width="128" height="1" fill="rgba(16,185,129,0.06)" />
            <rect y="2" width="128" height="1" fill="rgba(16,185,129,0.03)" />
          </pattern>

          {/* Glow filter for lines */}
          <filter id={`${id}-lineGlow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <g clipPath={`url(#${id}-clip)`}>
          {/* Dark base */}
          <circle cx="64" cy="64" r="62" fill="#0a0a0f" />

          {/* Glow orb */}
          <circle cx="64" cy="56" r="40" fill={`url(#${id}-glow)`} />

          {/* Grid lines (subtle) */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0" y1={14 * (i + 1)}
              x2="128" y2={14 * (i + 1)}
              stroke="#10b981" strokeOpacity="0.06" strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={14 * (i + 1)} y1="0"
              x2={14 * (i + 1)} y2="128"
              stroke="#10b981" strokeOpacity="0.06" strokeWidth="0.5"
            />
          ))}

          {/* Circuit traces */}
          <g stroke="#10b981" strokeWidth="0.7" opacity="0.2" filter={`url(#${id}-lineGlow)`}>
            <path d="M 20 90 L 20 70 L 35 70" />
            <path d="M 108 90 L 108 70 L 93 70" />
            <path d="M 30 110 L 30 100 L 50 100" />
            <path d="M 98 110 L 98 100 L 78 100" />
            <circle cx="35" cy="70" r="1.5" fill="#10b981" />
            <circle cx="93" cy="70" r="1.5" fill="#10b981" />
            <circle cx="50" cy="100" r="1.5" fill="#10b981" />
            <circle cx="78" cy="100" r="1.5" fill="#10b981" />
          </g>

          {/* ── Head silhouette ── */}
          <g filter={`url(#${id}-lineGlow)`}>
            {/* Head outline */}
            <path
              d="M 64 18
                 C 44 18, 34 35, 34 50
                 C 34 58, 37 64, 40 68
                 L 38 76
                 C 38 80, 42 84, 48 86
                 L 48 90
                 C 48 94, 54 97, 64 97
                 C 74 97, 80 94, 80 90
                 L 80 86
                 C 86 84, 90 80, 90 76
                 L 88 68
                 C 91 64, 94 58, 94 50
                 C 94 35, 84 18, 64 18 Z"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.7"
              fill="rgba(16,185,129,0.04)"
            />

            {/* Eye line — left */}
            <path
              d="M 44 52 L 52 52 L 56 48"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Eye line — right */}
            <path
              d="M 84 52 L 76 52 L 72 48"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.8;1;0.8"
                dur="2s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Eye dots */}
            <circle cx="50" cy="51" r="1.5" fill="#10b981" opacity="0.9">
              <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="78" cy="51" r="1.5" fill="#10b981" opacity="0.9">
              <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" begin="0.5s" repeatCount="indefinite" />
            </circle>

            {/* Nose line */}
            <line x1="64" y1="55" x2="64" y2="64" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.3" />

            {/* Mouth line */}
            <path
              d="M 54 70 Q 64 74, 74 70"
              stroke="#10b981"
              strokeWidth="0.8"
              strokeOpacity="0.3"
              strokeLinecap="round"
            />
          </g>

          {/* Horizontal data bands */}
          <g opacity="0.15">
            <rect x="0" y="44" width="30" height="1" fill="#34d399">
              <animate attributeName="width" values="30;20;30" dur="4s" repeatCount="indefinite" />
            </rect>
            <rect x="98" y="44" width="30" height="1" fill="#34d399">
              <animate attributeName="x" values="98;105;98" dur="4s" begin="1s" repeatCount="indefinite" />
            </rect>
            <rect x="0" y="60" width="20" height="1" fill="#34d399">
              <animate attributeName="width" values="20;28;20" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
            </rect>
            <rect x="108" y="60" width="20" height="1" fill="#34d399">
              <animate attributeName="x" values="108;100;108" dur="3.5s" begin="1.5s" repeatCount="indefinite" />
            </rect>
          </g>

          {/* Scan line overlay */}
          <rect width="128" height="128" fill={`url(#${id}-scan)`} />

          {/* Moving scan line */}
          <rect width="128" height="2" fill="#10b981" opacity="0.08">
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -2; 0 130; 0 -2"
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>

          {/* Glitch bars (intermittent) */}
          <rect x="0" y="48" width="128" height="2" fill="#10b981" opacity="0">
            <animate
              attributeName="opacity"
              values="0;0;0.15;0;0;0;0;0.1;0;0"
              dur="5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values="48;52;48;65;48"
              dur="5s"
              repeatCount="indefinite"
            />
          </rect>
        </g>

        {/* Outer ring */}
        <circle
          cx="64" cy="64" r="62"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Corner marks */}
        <g stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round">
          {/* Top-left */}
          <path d="M 14 8 L 8 8 L 8 14" />
          {/* Top-right */}
          <path d="M 114 8 L 120 8 L 120 14" />
          {/* Bottom-left */}
          <path d="M 14 120 L 8 120 L 8 114" />
          {/* Bottom-right */}
          <path d="M 114 120 L 120 120 L 120 114" />
        </g>

        {/* Status indicator dot */}
        <circle cx="104" cy="104" r="5" fill="#0a0a0f" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="104" cy="104" r="2.5" fill="#10b981">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Outer glow ring (CSS) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: "0 0 20px rgba(16,185,129,0.15), inset 0 0 20px rgba(16,185,129,0.05)",
        }}
      />
    </div>
  );
}
