"use client";

export interface SkySettings {
  light: number;
  cloud: number;
  rain: number;
  glow: string;
  bottom: string;
  top: string;
  wind: number;
  windGust: number;
  windX: number;
  sunX: number;
  solarAltitude: number;
  phaseName: string;
}

interface SkyStop {
  hour: number;
  light: number;
  solarAltitude: number;
  sunX: number;
  top: string;
  bottom: string;
  glow: string;
  cloud: number;
  rain: number;
  wind: number;
  windGust: number;
  phaseName: string;
}

// 24-Hour Sky Cycle calibrated against Thoufik reference captures:
// Image 1: 9:15 AM Daylight -> light: 0.95, solarAltitude: 38, glow: #edf3ff, bottom: #c9e4f3, top: #388bca
// Image 2: 5:30 PM Golden hour -> light: 0.78, solarAltitude: 8, glow: #ffd1a0, bottom: #f3b56e, top: #3e7195
// Image 3 & 4: 10:15 PM Night -> light: 0.20, solarAltitude: -25, glow: #4a6080, bottom: #24334a, top: #172340
const SKY_STOPS: SkyStop[] = [
  {
    hour: 0,
    light: 0.20,
    solarAltitude: -25,
    sunX: 0.7,
    top: "#172340",
    bottom: "#24334a",
    glow: "#4a6080",
    cloud: 0.15,
    rain: 0,
    wind: 5,
    windGust: 7,
    phaseName: "Night",
  },
  {
    hour: 4.5,
    light: 0.20,
    solarAltitude: -20,
    sunX: 0.75,
    top: "#172340",
    bottom: "#24334a",
    glow: "#4a6080",
    cloud: 0.18,
    rain: 0,
    wind: 5,
    windGust: 6,
    phaseName: "Night",
  },
  {
    hour: 5.5,
    light: 0.72,
    solarAltitude: 3,
    sunX: 0.82,
    top: "#738ea9",
    bottom: "#e9c7b7",
    glow: "#f4b69d",
    cloud: 0.28,
    rain: 0,
    wind: 5.5,
    windGust: 7.5,
    phaseName: "Dawn",
  },
  {
    hour: 6.75,
    light: 0.85,
    solarAltitude: 14,
    sunX: 0.76,
    top: "#4a94ce",
    bottom: "#d8ebf7",
    glow: "#f0f5ff",
    cloud: 0.2,
    rain: 0,
    wind: 6,
    windGust: 8,
    phaseName: "Daylight",
  },
  {
    hour: 9.25, // 9:15 AM
    light: 0.95,
    solarAltitude: 38,
    sunX: 0.65,
    top: "#388bca",
    bottom: "#c9e4f3",
    glow: "#edf3ff",
    cloud: 0.15,
    rain: 0,
    wind: 6,
    windGust: 8,
    phaseName: "Daylight",
  },
  {
    hour: 12, // Noon zenith
    light: 1.0,
    solarAltitude: 65,
    sunX: 0.5,
    top: "#388bca",
    bottom: "#c9e4f3",
    glow: "#edf3ff",
    cloud: 0.12,
    rain: 0,
    wind: 6.5,
    windGust: 9,
    phaseName: "Daylight",
  },
  {
    hour: 15.5, // Mid afternoon
    light: 0.95,
    solarAltitude: 42,
    sunX: 0.42,
    top: "#388bca",
    bottom: "#c9e4f3",
    glow: "#edf3ff",
    cloud: 0.18,
    rain: 0,
    wind: 6,
    windGust: 8,
    phaseName: "Daylight",
  },
  {
    hour: 17.5, // 5:30 PM Golden hour
    light: 0.78,
    solarAltitude: 8,
    sunX: 0.35,
    top: "#3e7195",
    bottom: "#f3b56e",
    glow: "#ffd1a0",
    cloud: 0.25,
    rain: 0,
    wind: 5.5,
    windGust: 7,
    phaseName: "Golden hour",
  },
  {
    hour: 18.25, // Sunset / Dusk
    light: 0.55,
    solarAltitude: -2,
    sunX: 0.3,
    top: "#6976a3",
    bottom: "#e99c9d",
    glow: "#f0b5b0",
    cloud: 0.3,
    rain: 0,
    wind: 5,
    windGust: 6.5,
    phaseName: "Dusk",
  },
  {
    hour: 19.5, // Twilight
    light: 0.28,
    solarAltitude: -12,
    sunX: 0.45,
    top: "#2b3b5e",
    bottom: "#5b4a6b",
    glow: "#6a526d",
    cloud: 0.22,
    rain: 0,
    wind: 4.5,
    windGust: 6,
    phaseName: "Dusk",
  },
  {
    hour: 21,
    light: 0.22,
    solarAltitude: -20,
    sunX: 0.65,
    top: "#172340",
    bottom: "#24334a",
    glow: "#4a6080",
    cloud: 0.16,
    rain: 0,
    wind: 4,
    windGust: 5.5,
    phaseName: "Night",
  },
  {
    hour: 22.25, // 10:15 PM Night
    light: 0.20,
    solarAltitude: -25,
    sunX: 0.7,
    top: "#172340",
    bottom: "#24334a",
    glow: "#4a6080",
    cloud: 0.15,
    rain: 0,
    wind: 4,
    windGust: 5,
    phaseName: "Night",
  },
  {
    hour: 24,
    light: 0.1,
    solarAltitude: -25,
    sunX: 0.7,
    top: "#172340",
    bottom: "#2b3b56",
    glow: "#3a4b68",
    cloud: 0.15,
    rain: 0,
    wind: 4,
    windGust: 5,
    phaseName: "Night",
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = (num >> 8) & 15;
    const g = (num >> 4) & 15;
    const b = num & 15;
    return [(r << 4) | r, (g << 4) | g, (b << 4) | b];
  }
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}

function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function getSkySettingsForHour(
  hour: number,
  weatherOverride?: Partial<SkySettings>
): SkySettings {
  const normHour = ((hour % 24) + 24) % 24;

  let prev = SKY_STOPS[0];
  let next = SKY_STOPS[SKY_STOPS.length - 1];

  for (let i = 0; i < SKY_STOPS.length - 1; i++) {
    if (normHour >= SKY_STOPS[i].hour && normHour <= SKY_STOPS[i + 1].hour) {
      prev = SKY_STOPS[i];
      next = SKY_STOPS[i + 1];
      break;
    }
  }

  const span = next.hour - prev.hour;
  const t = span === 0 ? 0 : (normHour - prev.hour) / span;
  // Smoothstep easing for natural sunlight transitions
  const s = t * t * (3 - 2 * t);

  const base: SkySettings = {
    light: lerp(prev.light, next.light, s),
    solarAltitude: lerp(prev.solarAltitude, next.solarAltitude, s),
    sunX: lerp(prev.sunX, next.sunX, s),
    top: lerpColor(prev.top, next.top, s),
    bottom: lerpColor(prev.bottom, next.bottom, s),
    glow: lerpColor(prev.glow, next.glow, s),
    cloud: lerp(prev.cloud, next.cloud, s),
    rain: lerp(prev.rain, next.rain, s),
    wind: lerp(prev.wind, next.wind, s),
    windGust: lerp(prev.windGust, next.windGust, s),
    windX: 1,
    phaseName: t < 0.5 ? prev.phaseName : next.phaseName,
  };

  if (weatherOverride) {
    for (const [key, value] of Object.entries(weatherOverride)) {
      if (value !== undefined) {
        (base as any)[key] = value;
      }
    }
  }

  return base;
}

export function getSkySettingsForPreset(
  preset: "day" | "golden" | "dusk" | "night" | "dawn",
  weatherOverride?: Partial<SkySettings>
): SkySettings {
  const hourMap: Record<string, number> = {
    day: 9.25, // 9:15 AM
    golden: 17.5, // 5:30 PM
    dusk: 18.5, // 6:30 PM
    night: 22.25, // 10:15 PM
    dawn: 5.5, // 5:30 AM
  };
  return getSkySettingsForHour(hourMap[preset] ?? 12, weatherOverride);
}

export const SKY_UPDATE_EVENT = "sky:weather-update";

export function dispatchSkyUpdate(settings: SkySettings): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SKY_UPDATE_EVENT, { detail: settings })
    );
  }
}

export function subscribeSkyUpdate(
  callback: (settings: SkySettings) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<SkySettings>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };
  window.addEventListener(SKY_UPDATE_EVENT, handler);
  return () => window.removeEventListener(SKY_UPDATE_EVENT, handler);
}
