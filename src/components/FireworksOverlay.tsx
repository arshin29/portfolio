"use client";

import React, { useEffect, useRef } from "react";
import { skySound } from "@/lib/sound";

interface FireworksOverlayProps {
  active: boolean;
  soundEnabled?: boolean;
}

// Stage 1: Ascending rocket trail
interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  palette: string[];
  trailLength: number;
}

// Stage 2: Radial burst spark (recreating Thoufik's ring of dashed lines)
interface SparkLine {
  angle: number;
  dist: number; // Current distance from explosion center
  speed: number;
  length: number; // Length of the dashed stroke
  color: string;
  lineWidth: number;
}

interface Explosion {
  cx: number;
  cy: number;
  sparks: SparkLine[];
  alpha: number;
  decay: number;
}

export default function FireworksOverlay({
  active,
  soundEnabled = false,
}: FireworksOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const soundRef = useRef(soundEnabled);
  activeRef.current = active;
  soundRef.current = soundEnabled;

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let rockets: Rocket[] = [];
    let explosions: Explosion[] = [];
    let lastSpawnTime = performance.now();
    let spawnInterval = 1600 + Math.random() * 1200;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Palettes matching Thoufik's captures:
    // Image 1 & 4: Warm amber launch rocket
    // Image 2: Multi-color bursts (teal/cyan, orange/red, warm gold)
    // Image 3: Glowing violet / lilac burst
    const PALETTES = [
      ["#f59e0b", "#fbbf24", "#fde047", "#f97316", "#ffedd5"], // Golden Amber (reference)
      ["#c084fc", "#a855f7", "#d8b4fe", "#e879f9", "#f3e8ff"], // Lilac / Violet (Image 3)
      ["#38bdf8", "#0284c7", "#7dd3fc", "#2dd4bf", "#e0f2fe"], // Teal / Cyan (Image 2)
      ["#f87171", "#ef4444", "#fb923c", "#fca5a5", "#ffedd5"], // Coral / Orange (Image 2)
    ];

    const launchRocket = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Keep safe margin from edges so rays never leave viewport (max burst radius is ~45px)
      const maxBurstRadius = 55;
      const marginX = maxBurstRadius + 40;
      const cx = Math.max(marginX, Math.min(w - marginX, w * (0.28 + Math.random() * 0.44)));

      // Explode strictly between 18% and 38% down, with top safe margin
      const targetY = Math.max(maxBurstRadius + 20, h * (0.18 + Math.random() * 0.20));
      const startY = Math.min(h - 40, targetY + (100 + Math.random() * 60));

      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const rocketColor = palette[0];

      rockets.push({
        x: cx,
        y: startY,
        targetY,
        speed: 3.5 + Math.random() * 1.2,
        color: rocketColor,
        palette,
        trailLength: 24 + Math.random() * 14, // Clean vertical line trail (Images 1 & 4)
      });
    };

    const triggerExplosion = (cx: number, cy: number, palette: string[]) => {
      // Create radial dashed rays matching the exact circular crown look in Thoufik's screenshots
      const sparkCount = 30 + Math.floor(Math.random() * 10);
      const sparks: SparkLine[] = [];
      const baseSpeed = 1.0 + Math.random() * 0.4; // Controlled expansion

      for (let i = 0; i < sparkCount; i++) {
        // Uniform radial angle around the circle
        const angle = (i / sparkCount) * Math.PI * 2;
        const color = palette[i % palette.length];

        sparks.push({
          angle,
          dist: 6 + Math.random() * 4,
          speed: baseSpeed * (0.85 + Math.random() * 0.3),
          length: 10 + Math.random() * 8, // Length of the dashed stroke
          color,
          lineWidth: 1.5 + Math.random() * 0.6,
        });
      }

      explosions.push({
        cx,
        cy,
        sparks,
        alpha: 1,
        decay: 0.018 + Math.random() * 0.008,
      });

      if (soundRef.current) {
        skySound.playFireworkSound();
      }
    };

    // Initial launch
    launchRocket();

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Spawn new rockets
      if (activeRef.current && time - lastSpawnTime > spawnInterval) {
        launchRocket();
        lastSpawnTime = time;
        spawnInterval = 1800 + Math.random() * 1400;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. UPDATE & DRAW ROCKETS (clean vertical rising streak)
      for (let r = rockets.length - 1; r >= 0; r--) {
        const rock = rockets[r];
        rock.y -= rock.speed * 60 * dt;

        ctx.save();
        ctx.strokeStyle = rock.color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.shadowColor = rock.color;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(rock.x, rock.y);
        ctx.lineTo(rock.x, rock.y + rock.trailLength);
        ctx.stroke();
        ctx.restore();

        // Check if rocket reached its explosion altitude
        if (rock.y <= rock.targetY) {
          triggerExplosion(rock.x, rock.targetY, rock.palette);
          rockets.splice(r, 1);
        }
      }

      // 2. UPDATE & DRAW RADIAL DASHED BURSTS (Thoufik's exact crown/ring burst)
      for (let e = explosions.length - 1; e >= 0; e--) {
        const exp = explosions[e];
        exp.alpha -= exp.decay * 60 * dt;

        if (exp.alpha <= 0) {
          explosions.splice(e, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, exp.alpha);

        for (let i = 0; i < exp.sparks.length; i++) {
          const s = exp.sparks[i];
          s.dist += s.speed * 60 * dt;
          s.speed *= 0.982; // Slight air drag

          const cos = Math.cos(s.angle);
          const sin = Math.sin(s.angle);

          // Ray starts at inner radius and extends outwards by length
          const x1 = exp.cx + cos * s.dist;
          const y1 = exp.cy + sin * s.dist;
          const x2 = exp.cx + cos * (s.dist + s.length);
          const y2 = exp.cy + sin * (s.dist + s.length);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.lineWidth;
          ctx.lineCap = "round";
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
          ctx.stroke();
        }

        ctx.restore();
      }

      if (activeRef.current || rockets.length > 0 || explosions.length > 0) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      if (canvas && ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
      aria-hidden="true"
    />
  );
}
