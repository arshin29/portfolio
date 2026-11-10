"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { skySound } from "@/lib/sound";

export type SkyOption = "night" | "dawn" | "day" | "dusk";

interface NightSkyDialProps {
  realTimeHours: number;
  realTimeMinutes: number;
  timeZone: string;
  skyOption: SkyOption;
  isDayWeather?: boolean;
  onExploreChange?: (isExploring: boolean, exploredHours?: number, exploredMinutes?: number) => void;
}

export default function NightSkyDial({
  realTimeHours,
  realTimeMinutes,
  timeZone,
  skyOption,
  isDayWeather = false,
  onExploreChange,
}: NightSkyDialProps) {
  const [isExploring, setIsExploring] = useState(false);
  const [exploredMinutesTotal, setExploredMinutesTotal] = useState<number>(
    realTimeHours * 60 + realTimeMinutes
  );
  const [isDragging, setIsDragging] = useState(false);
  const lastSoundTickRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Semicircular SVG dimensions (calibrated for 326px x 343px panel)
  const width = 276;
  const height = 150;
  const cx = 138;
  const cy = 138;
  const radius = 112;

  const realMinutesTotal = realTimeHours * 60 + realTimeMinutes;
  const activeMinutesTotal = isExploring ? exploredMinutesTotal : realMinutesTotal;
  const displayedHours = Math.floor(activeMinutesTotal / 60) % 24;
  const displayedMinutes = activeMinutesTotal % 60;

  useEffect(() => {
    if (!isExploring) {
      setExploredMinutesTotal(realTimeHours * 60 + realTimeMinutes);
    }
  }, [realTimeHours, realTimeMinutes, isExploring]);

  // 24-hour night sky cycle mapping (Matches Screenshots 3 & 4):
  // Zenith (solar midnight / 2:00 AM) is positioned at apex 90° (Math.PI / 2).
  // Left base (angle Math.PI = 180°): 2:00 PM (14:00) afternoon.
  // At 2:34 AM: fraction is ~0.5236, pointing upright at ~85.7° (just right of vertical apex).
  // At 2:55 AM: fraction is ~0.5382, pointing at ~83.1° (matching Screenshot 4).
  // Sunrise (5:30 AM): angle ~64° (where golden daylight ticks begin).
  // Right base (angle 0°): 2:00 PM (14:00) afternoon.
  const offsetMinutes = (activeMinutesTotal - (14 * 60) + 1440) % 1440;
  const fraction = offsetMinutes / 1440;
  const currentAngle = Math.PI * (1 - fraction);

  // Semicircular Arc Path
  const leftX = cx - radius;
  const leftY = cy;
  const rightX = cx + radius;
  const rightY = cy;
  const arcBackgroundPath = `M ${leftX} ${leftY} A ${radius} ${radius} 0 0 1 ${rightX} ${rightY}`;

  // Faceted Origami Triangular Pointer (Compass needle pointing to active arc position)
  // Matches the faceted triangle in Screenshots 3 & 4: Left facet pure white (#ffffff), right facet shaded (#cbd5e1)
  // Scaled and positioned so needle base stays above y = 58px, avoiding any text collision.
  const tipRadius = radius - 3;
  const baseRadius = radius - 23;
  const baseHalfWidth = 7.5;

  const tipX = cx + tipRadius * Math.cos(currentAngle);
  const tipY = cy - tipRadius * Math.sin(currentAngle);

  const tanX = Math.sin(currentAngle);
  const tanY = Math.cos(currentAngle);

  const baseCenterX = cx + baseRadius * Math.cos(currentAngle);
  const baseCenterY = cy - baseRadius * Math.sin(currentAngle);

  // Inward notch at the base
  const notchX = cx + (baseRadius + 4) * Math.cos(currentAngle);
  const notchY = cy - (baseRadius + 4) * Math.sin(currentAngle);

  const corner1X = baseCenterX + baseHalfWidth * tanX;
  const corner1Y = baseCenterY + baseHalfWidth * tanY;

  const corner2X = baseCenterX - baseHalfWidth * tanX;
  const corner2Y = baseCenterY - baseHalfWidth * tanY;

  const leftFacetPoints = `${tipX},${tipY} ${corner1X},${corner1Y} ${notchX},${notchY}`;
  const rightFacetPoints = `${tipX},${tipY} ${notchX},${notchY} ${corner2X},${corner2Y}`;

  // Drag calculation
  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      const px = (clientX - rect.left) * scaleX;
      const py = (clientY - rect.top) * scaleY;

      const dx = px - cx;
      const dy = py - cy;

      let angle = Math.atan2(-dy, dx);
      if (angle < 0) {
        angle = dx >= 0 ? 0 : Math.PI;
      }

      const f = 1 - angle / Math.PI;
      const clampedF = Math.max(0, Math.min(1, f));
      const totalMins = Math.round((clampedF * 1440 + 14 * 60)) % 1440;

      setExploredMinutesTotal(totalMins);
      setIsExploring(true);

      const interval30 = Math.floor(totalMins / 30);
      if (interval30 !== lastSoundTickRef.current) {
        lastSoundTickRef.current = interval30;
        skySound.playTick();
      }

      if (onExploreChange) {
        const h = Math.floor(totalMins / 60) % 24;
        const m = totalMins % 60;
        onExploreChange(true, h, m);
      }
    },
    [cx, cy, onExploreChange, radius]
  );

  // Pointer drag listeners
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      updatePointerPosition(clientX, clientY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, updatePointerPosition]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const resetToLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExploring(false);
    setExploredMinutesTotal(realMinutesTotal);
    if (onExploreChange) {
      onExploreChange(false);
    }
  };

  // Formatted 12-hour digital time
  const period = displayedHours >= 12 ? "PM" : "AM";
  const display12Hours = displayedHours % 12 === 0 ? 12 : displayedHours % 12;
  const formattedMinutes = displayedMinutes < 10 ? `0${displayedMinutes}` : displayedMinutes;
  const formattedTimeString = `${display12Hours}:${formattedMinutes} ${period}`;

  // 1. Prominent Outer Ticks with Muted-Blue to Warm-Accent Progression (Matches Screenshot 3)
  const outerTicksCount = 41;
  const outerTicks = Array.from({ length: outerTicksCount }).map((_, i) => {
    const f = i / (outerTicksCount - 1);
    const a = Math.PI * (1 - f);
    const r1 = radius + 3;
    const r2 = radius + 11;

    const x1 = cx + r1 * Math.cos(a);
    const y1 = cy - r1 * Math.sin(a);
    const x2 = cx + r2 * Math.cos(a);
    const y2 = cy - r2 * Math.sin(a);

    // Color progression (Matches Screenshot 3):
    // Left side & apex (0 to 25) are muted slate-blue night ticks.
    // Right side (26 to 39) are glowing golden amber daylight ticks.
    let strokeColor = "rgba(100, 135, 175, 0.55)"; // Muted slate blue
    if (i >= 26 && i <= 39) {
      strokeColor = "#fbbf24"; // Warm gold/amber
    } else if (i === 25 || i === 40) {
      strokeColor = "#d97706";
    }

    return { x1, y1, x2, y2, strokeColor };
  });

  // 2. Fine Inner Ticks
  const innerTicksCount = 61;
  const innerTicks = Array.from({ length: innerTicksCount }).map((_, i) => {
    const f = i / (innerTicksCount - 1);
    const a = Math.PI * (1 - f);
    const r1 = radius - 8;
    const r2 = radius - 2;

    const x1 = cx + r1 * Math.cos(a);
    const y1 = cy - r1 * Math.sin(a);
    const x2 = cx + r2 * Math.cos(a);
    const y2 = cy - r2 * Math.sin(a);

    return { x1, y1, x2, y2 };
  });

  return (
    <div className="relative flex flex-col items-center select-none pt-1 pb-0">
      {/* Semicircular Clock Dial */}
      <div className="relative w-[280px] h-[154px] flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-pointer touch-none overflow-visible"
          onPointerDown={handlePointerDown}
          aria-label="Interactive semicircular time clock. Drag to explore different times."
        >
          <defs>
            <filter id="dialNeedleShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.45)" />
            </filter>
          </defs>

          {/* Fine Inner Tick Marks */}
          {innerTicks.map((t, idx) => (
            <line
              key={`in-${idx}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="1"
            />
          ))}

          {/* Thin Semicircular Arc Line */}
          <path
            d={arcBackgroundPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Celestial Meridian Zenith Tick (Matches Screenshots 3 & 4) */}
          <line
            x1={cx}
            y1={cy - radius + 8}
            x2={cx}
            y2={cy - radius - 10}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.2"
          />

          {/* Prominent Outer Ticks (Muted blue to warm gold accent) */}
          {outerTicks.map((t, idx) => (
            <line
              key={`out-${idx}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.strokeColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}

          {/* Faceted 3D Origami Triangular Pointer (Screenshots 3 & 4 Match) */}
          <g filter="url(#dialNeedleShadow)">
            {/* Left Facet: Bright Pure White */}
            <polygon
              points={leftFacetPoints}
              fill="#ffffff"
            />
            {/* Right Facet: Soft Silver-Grey Shading */}
            <polygon
              points={rightFacetPoints}
              fill="#cbd5e1"
            />
          </g>
        </svg>

        {/* Large Digital Time & Instruction (Center - positioned cleanly below pointer sweep) */}
        <div className="absolute top-[70px] flex flex-col items-center pointer-events-none text-center">
          <span className="text-[29px] font-semibold text-white tracking-tight font-sans leading-none drop-shadow-md">
            {formattedTimeString}
          </span>

          <span className="text-[12px] text-white/65 font-sans tracking-normal mt-1.5">
            {isExploring ? "Explored time" : "Drag to explore"}
          </span>
        </div>
      </div>

      {/* Reset to Live Time Pill (Visible when exploring) */}
      {isExploring && (
        <div className="mt-1 flex items-center justify-center">
          <button
            onClick={resetToLive}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-sans px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3 h-3 text-amber-300" />
            <span>Reset to live time</span>
          </button>
        </div>
      )}
    </div>
  );
}
