export default function DecorativeRadial() {
  return (
    <div
      className="pointer-events-none select-none relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center opacity-85"
      aria-hidden="true"
    >
      {/* Radiant glow backdrop */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/20 via-sky-500/10 to-transparent blur-3xl transform scale-75" />

      {/* SVG Radial Circles, Celestial Ticks, and Orbit Rings */}
      <svg
        className="w-full h-full text-blue-200/40"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outermost faint coordinate ring */}
        <circle
          cx="200"
          cy="200"
          r="185"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 8"
        />

        {/* Major orbit ring */}
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />

        {/* Intermediate dashed track */}
        <circle
          cx="200"
          cy="200"
          r="115"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeDasharray="2 6"
        />

        {/* Inner concentric ring */}
        <circle
          cx="200"
          cy="200"
          r="80"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />

        {/* Innermost focused orb */}
        <circle
          cx="200"
          cy="200"
          r="45"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
        />

        {/* Center glowing star point */}
        <circle cx="200" cy="200" r="4" fill="#93c5fd" />
        <circle cx="200" cy="200" r="10" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.6" />

        {/* Celestial tick marks at 0, 90, 180, 270 */}
        <line x1="200" y1="10" x2="200" y2="24" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="200" y1="376" x2="200" y2="390" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="10" y1="200" x2="24" y2="200" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
        <line x1="376" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Angle markers / secondary ticks */}
        <line x1="65" y1="65" x2="75" y2="75" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="335" y1="65" x2="325" y2="75" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="65" y1="335" x2="75" y2="325" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="335" y1="335" x2="325" y2="325" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />

        {/* Satellite node along the 150r orbit */}
        <circle cx="306" cy="94" r="5" fill="#38bdf8" />
        <circle cx="306" cy="94" r="11" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

        {/* Secondary node along the 115r track */}
        <circle cx="118" cy="282" r="3.5" fill="#818cf8" />

        {/* Subtle typography coordinates */}
        <text
          x="200"
          y="42"
          textAnchor="middle"
          fill="currentColor"
          fillOpacity="0.45"
          fontSize="9"
          fontFamily="monospace"
        >
          00° 00&apos; N
        </text>
        <text
          x="355"
          y="204"
          textAnchor="start"
          fill="currentColor"
          fillOpacity="0.45"
          fontSize="9"
          fontFamily="monospace"
        >
          24h 00m
        </text>
      </svg>
    </div>
  );
}
