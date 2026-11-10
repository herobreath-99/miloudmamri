import type { BodyPart } from "@/data/exercises";

/**
 * Premium stylized female 3D-look figure rendered in SVG.
 * - Neon glow + glassmorphism aesthetic
 * - Animated active body part (pulse + motion path)
 * - Direction arrows showing movement trajectory
 * - Supports parent-driven rotateY / zoom for interactive viewing
 */
export function BodyFigure({
  active,
  animate,
  rotateY = 0,
  zoom = 1,
}: {
  active: BodyPart;
  animate: boolean;
  rotateY?: number;
  zoom?: number;
}) {
  const neon = "oklch(0.78 0.20 350)";
  const neonSoft = "oklch(0.88 0.14 340)";
  const violet = "oklch(0.72 0.18 320)";
  const skin = "oklch(0.93 0.035 30)";
  const skinShade = "oklch(0.84 0.05 30)";

  const isArm = active === "arm";
  const isShoulder = active === "shoulder";
  const isChest = active === "chest";
  const isBreath = active === "breathing";

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <svg
        viewBox="0 0 240 320"
        className="w-full h-full drop-shadow-[0_18px_40px_rgba(236,72,153,0.35)]"
        style={{
          transform: `rotateY(${rotateY}deg) scale(${zoom})`,
          transition: "transform 0.35s cubic-bezier(.2,.9,.3,1.2)",
          transformStyle: "preserve-3d",
        }}
      >
        <defs>
          {/* Body gradient — glassy skin */}
          <linearGradient id="bodyG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={skin} />
            <stop offset="55%" stopColor={skinShade} />
            <stop offset="100%" stopColor="oklch(0.78 0.06 350)" />
          </linearGradient>
          {/* Neon halo */}
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={neon} stopOpacity="0.7" />
            <stop offset="60%" stopColor={violet} stopOpacity="0.18" />
            <stop offset="100%" stopColor={violet} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={neon} stopOpacity="0.55" />
            <stop offset="100%" stopColor={neon} stopOpacity="0" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
          {/* Edge lines gradient */}
          <linearGradient id="edge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={neon} stopOpacity="0.9" />
            <stop offset="100%" stopColor={violet} stopOpacity="0.6" />
          </linearGradient>

          <style>{`
            .arm-swing { transform-origin: 95px 112px; animation: armSwing 2.4s ease-in-out infinite; }
            .arm-side  { transform-origin: 95px 112px; animation: armSide  2.4s ease-in-out infinite; }
            .sh-roll   { transform-origin: 120px 112px; animation: shRoll 2.2s ease-in-out infinite; }
            .chest-pulse { transform-origin: 120px 150px; animation: chestPulse 2.6s ease-in-out infinite; }
            .breath-pulse { transform-origin: 120px 155px; animation: breathPulse 5s ease-in-out infinite; }
            .ring-pulse { transform-origin: center; animation: ringPulse 2s ease-out infinite; }
            .ring-pulse-2 { transform-origin: center; animation: ringPulse 2s ease-out infinite; animation-delay: .6s; }
            .ring-pulse-3 { transform-origin: center; animation: ringPulse 2s ease-out infinite; animation-delay: 1.2s; }
            .arrow-flow { stroke-dasharray: 6 6; animation: dash 1.4s linear infinite; }
            .arrow-rot  { transform-origin: 120px 112px; animation: arrowRot 2.2s linear infinite; }
            .floor-pulse{ animation: floorP 3s ease-in-out infinite; transform-origin: center; }
            @keyframes armSwing { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-115deg); } }
            @keyframes armSide  { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-80deg); } }
            @keyframes shRoll   { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-4px) rotate(8deg); } }
            @keyframes chestPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.07); } }
            @keyframes breathPulse{ 0%,100% { transform: scale(1); opacity:.85 } 50% { transform: scale(1.14); opacity:1 } }
            @keyframes ringPulse  { 0% { transform: scale(.6); opacity:.9 } 100% { transform: scale(1.5); opacity:0 } }
            @keyframes dash       { to { stroke-dashoffset: -24; } }
            @keyframes arrowRot   { to { transform: rotate(360deg); } }
            @keyframes floorP     { 0%,100% { transform: scale(1); opacity:.7 } 50% { transform: scale(1.1); opacity:1 } }
          `}</style>
        </defs>

        {/* Floor reflection / spotlight */}
        <ellipse
          cx="120"
          cy="305"
          rx="80"
          ry="10"
          fill="url(#floor)"
          className={animate ? "floor-pulse" : ""}
        />

        {/* Background atmospheric halo around the active region */}
        {isArm && <circle cx="65" cy="170" r="65" fill="url(#halo)" />}
        {isShoulder && <circle cx="120" cy="112" r="78" fill="url(#halo)" />}
        {(isChest || isBreath) && <circle cx="120" cy="150" r="70" fill="url(#halo)" />}

        {/* Hair */}
        <path
          d="M82,72 C82,38 158,38 158,74 C162,98 160,118 154,122 L86,122 C80,118 78,98 82,72 Z"
          fill="oklch(0.32 0.06 30)"
        />
        <path
          d="M82,72 C82,38 158,38 158,74"
          stroke={neon}
          strokeWidth="0.6"
          opacity="0.6"
          fill="none"
        />

        {/* Head */}
        <ellipse cx="120" cy="80" rx="26" ry="30" fill={skin} />
        <ellipse
          cx="120"
          cy="80"
          rx="26"
          ry="30"
          fill="none"
          stroke="url(#edge)"
          strokeWidth="0.6"
          opacity="0.7"
        />
        {/* Face hints */}
        <circle cx="111" cy="80" r="1.6" fill="oklch(0.3 0.05 30)" />
        <circle cx="129" cy="80" r="1.6" fill="oklch(0.3 0.05 30)" />
        <path
          d="M114,92 Q120,96 126,92"
          stroke="oklch(0.5 0.12 20)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Neck */}
        <rect x="112" y="102" width="16" height="14" fill={skin} />

        {/* Torso */}
        <path d="M85,118 Q120,108 155,118 L168,212 Q120,228 72,212 Z" fill="url(#bodyG)" />
        {/* Neon edge lines on torso */}
        <path
          d="M85,118 Q120,108 155,118 L168,212 Q120,228 72,212 Z"
          fill="none"
          stroke="url(#edge)"
          strokeWidth="0.8"
          opacity="0.85"
          filter="url(#softGlow)"
        />

        {/* Chest area (pulses when active) */}
        <g
          className={
            animate && (isChest || isBreath) ? (isBreath ? "breath-pulse" : "chest-pulse") : ""
          }
          filter={isChest || isBreath ? "url(#neonGlow)" : undefined}
        >
          <ellipse
            cx="105"
            cy="150"
            rx="14"
            ry="11"
            fill={isChest || isBreath ? neon : skinShade}
            opacity="0.85"
          />
          <ellipse
            cx="135"
            cy="150"
            rx="14"
            ry="11"
            fill={isChest || isBreath ? neon : skinShade}
            opacity="0.85"
          />
        </g>

        {/* Right (static) arm */}
        <g opacity="0.95">
          <circle cx="150" cy="112" r="10" fill={skinShade} />
          <rect x="146" y="120" rx="9" ry="9" width="16" height="78" fill={skinShade} />
          <circle cx="154" cy="200" r="9" fill={skinShade} />
        </g>

        {/* Shoulder pulse rings (when shoulder active) */}
        {animate && isShoulder && (
          <g style={{ transformOrigin: "120px 112px" }}>
            <circle
              cx="120"
              cy="112"
              r="22"
              fill="none"
              stroke={neon}
              strokeWidth="1.4"
              className="ring-pulse"
            />
            <circle
              cx="120"
              cy="112"
              r="22"
              fill="none"
              stroke={neon}
              strokeWidth="1.4"
              className="ring-pulse-2"
            />
            <circle
              cx="120"
              cy="112"
              r="22"
              fill="none"
              stroke={neon}
              strokeWidth="1.4"
              className="ring-pulse-3"
            />
          </g>
        )}

        {/* Left arm — animated based on active part */}
        <g
          className={animate ? (isArm ? "arm-swing" : isShoulder ? "arm-side" : "") : ""}
          filter={isArm || isShoulder ? "url(#neonGlow)" : undefined}
        >
          <circle cx="95" cy="112" r="10" fill={isShoulder ? neon : isArm ? neonSoft : skinShade} />
          <rect
            x="86"
            y="120"
            rx="9"
            ry="9"
            width="16"
            height="78"
            fill={isArm || isShoulder ? neon : skinShade}
          />
          <circle cx="94" cy="200" r="9" fill={isArm || isShoulder ? neon : skinShade} />
        </g>

        {/* Direction arrow — arm raise */}
        {animate && isArm && (
          <g filter="url(#neonGlow)">
            <path
              d="M55,210 Q40,150 75,95"
              fill="none"
              stroke={neon}
              strokeWidth="2"
              strokeLinecap="round"
              className="arrow-flow"
            />
            <polygon points="75,95 70,103 82,102" fill={neon} />
          </g>
        )}

        {/* Rotation arrow — shoulder */}
        {animate && isShoulder && (
          <g className="arrow-rot" filter="url(#neonGlow)">
            <path
              d="M120,82 A30,30 0 1,1 119.9,82"
              fill="none"
              stroke={neon}
              strokeWidth="2"
              strokeLinecap="round"
              className="arrow-flow"
            />
            <polygon points="120,82 114,76 116,86" fill={neon} />
          </g>
        )}

        {/* Chest opening arrows */}
        {animate && isChest && (
          <g filter="url(#neonGlow)">
            <path
              d="M105,150 Q70,140 55,148"
              fill="none"
              stroke={neon}
              strokeWidth="2"
              className="arrow-flow"
            />
            <polygon points="55,148 62,144 62,152" fill={neon} />
            <path
              d="M135,150 Q170,140 185,148"
              fill="none"
              stroke={neon}
              strokeWidth="2"
              className="arrow-flow"
            />
            <polygon points="185,148 178,144 178,152" fill={neon} />
          </g>
        )}

        {/* Breathing rings */}
        {animate && isBreath && (
          <g style={{ transformOrigin: "120px 155px" }}>
            <circle
              cx="120"
              cy="155"
              r="30"
              fill="none"
              stroke={neon}
              strokeWidth="1.4"
              className="ring-pulse"
            />
            <circle
              cx="120"
              cy="155"
              r="30"
              fill="none"
              stroke={neonSoft}
              strokeWidth="1.4"
              className="ring-pulse-2"
            />
            <circle
              cx="120"
              cy="155"
              r="30"
              fill="none"
              stroke={violet}
              strokeWidth="1.4"
              className="ring-pulse-3"
            />
          </g>
        )}

        {/* Hips & skirt */}
        <path
          d="M75,208 Q120,224 165,208 L158,302 L132,308 L122,228 L118,228 L108,308 L82,302 Z"
          fill="oklch(0.55 0.16 350)"
        />
        <path
          d="M75,208 Q120,224 165,208 L158,302 L132,308 L122,228 L118,228 L108,308 L82,302 Z"
          fill="none"
          stroke="url(#edge)"
          strokeWidth="0.7"
          opacity="0.7"
          filter="url(#softGlow)"
        />

        {/* Joint markers — neon dots */}
        {[
          [95, 112],
          [150, 112],
          [94, 200],
          [154, 200],
          [120, 228],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill={neon} filter="url(#neonGlow)" />
        ))}
      </svg>
    </div>
  );
}
