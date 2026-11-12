"use client";

import React, { useRef, useMemo } from "react";
import QRCode from "qrcode";

interface TicketCardProps {
  id: string;
  name: string;
  premise: string;
  formula?: string;
  imageSrc: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  storyHref: string;
  href: string;
  toneA: string;
  toneB: string;
  tags: string[];
}

const BARCODE_WIDTH = 56;

function generateBarcode(seedStr: string) {
  let seed = [...seedStr].reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7);
  const bars: { x: number; w: number }[] = [];
  for (let x = 0; x < BARCODE_WIDTH; ) {
    seed = (seed * 1103515245 + 12345) & 2147483647;
    const r = seed % 20;
    const w = Math.min(r < 10 ? 1 : r < 17 ? 2 : 3, BARCODE_WIDTH - x);
    const gap = (seed >> 7) % 4 === 0 ? 2 : 1;
    bars.push({ x, w });
    x += w + gap;
  }
  return bars;
}

function TicketQRCode({ value }: { value: string }) {
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
      const n = qr.modules.size;
      const dark: [number, number][] = [];
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (qr.modules.get(r, c)) {
            dark.push([c, r]);
          }
        }
      }
      const pathD = dark.map(([x, y]) => `M${x + 1} ${y + 1}h1v1h-1z`).join("");
      return { size: n + 2, pathD };
    } catch {
      return { size: 37, pathD: "" };
    }
  }, [value]);

  return (
    <svg
      className="tk-qr"
      viewBox={`0 0 ${qrData.size} ${qrData.size}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={qrData.pathD} fill="#fff" />
    </svg>
  );
}

function TicketBarcode({ seed }: { seed: string }) {
  const bars = useMemo(() => generateBarcode(seed), [seed]);

  return (
    <svg
      className="tk-bars"
      viewBox={`0 0 ${BARCODE_WIDTH} 24`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {bars.map(({ x, w }, idx) => (
        <rect key={idx} x={x} y={0} width={w} height={24} fill="currentColor" />
      ))}
    </svg>
  );
}

export default function TicketCard({
  id,
  name,
  premise,
  formula,
  imageSrc,
  imagePosition = "center",
  imageFit = "cover",
  storyHref,
  href,
  toneA,
  toneB,
  tags,
}: TicketCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || typeof window === "undefined" || window.matchMedia("(max-width: 600px)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    cardRef.current.style.setProperty("--mx", (normX * 100).toFixed(1));
    cardRef.current.style.setProperty("--my", (normY * 100).toFixed(1));
    cardRef.current.style.setProperty("--rx", `${((0.5 - normY) * 5).toFixed(2)}deg`);
    cardRef.current.style.setProperty("--ry", `${((normX - 0.5) * 7).toFixed(2)}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
    cardRef.current.style.setProperty("--mx", "50");
    cardRef.current.style.setProperty("--my", "40");
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest(".tk-go")) return;
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="tk select-none"
      style={{
        ["--tone-a" as any]: toneA,
        ["--tone-b" as any]: toneB,
      }}
      aria-label={`Project ticket: ${name}. Click to open app.`}
    >
      <span className="tk-tilt">
        <span className="tk-body">
          <span className="tk-grain" aria-hidden="true" />

          {/* Left Photo Thumbnail */}
          <span className="tk-photo">
            <img
              src={imageSrc}
              alt={name}
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ objectPosition: imagePosition, objectFit: imageFit }}
            />
          </span>

          {/* Middle Text Column */}
          <span className="tk-text">
            <span className="tk-name">{name}</span>
            <span className="tk-premise">{premise}</span>
            {formula && <span className="tk-formula">{formula}</span>}
          </span>

          <span className="tk-shine" aria-hidden="true" />

          {/* Two Joined Action Buttons (.tk-go) */}
          <span className="tk-go">
            <button
              type="button"
              className="tk-go-a"
              aria-label={`Read story of ${name} (disabled)`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Read story
            </button>
            <a
              className="tk-go-b"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name} app`}
              onClick={(e) => e.stopPropagation()}
            >
              Open app
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </span>

          {/* Right Stub with Scannable QR Code and Barcode */}
          <span className="tk-stub" aria-hidden="true">
            <TicketQRCode value={href} />
            <span className="tk-info">
              <span className="tk-label">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </span>
              <TicketBarcode seed={id} />
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
