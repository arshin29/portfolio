"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Moon,
  Sun,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Volume2,
  VolumeX,
  ChevronDown,
  RotateCw,
  X,
  Search,
  Check,
} from "lucide-react";
import {
  CityLocation,
  WeatherData,
  PRESET_CITIES,
  fetchWeather,
  reverseGeocode,
  searchCities,
  formatTimeForZone,
  getHoursMinutesForZone,
} from "@/lib/weather";
import { skySound } from "@/lib/sound";
import NightSkyDial, { SkyOption } from "./NightSkyDial";
import { getSkySettingsForHour, dispatchSkyUpdate, SkySettings } from "@/lib/skyController";

type WeatherMode = "auto" | "clear" | "cloudy" | "rain";

interface InteractiveSkyWidgetProps {
  className?: string;
}

export default function InteractiveSkyWidget({
  className = "",
}: InteractiveSkyWidgetProps) {
  // Widget Open & Reveal States
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileRevealed, setIsMobileRevealed] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Panel unmount transition state
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  // Location & Weather state
  const [location, setLocation] = useState<CityLocation>(PRESET_CITIES[0]); // Ratnagiri
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Time tracking
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeString, setTimeString] = useState<string>("8:45 PM");

  // Exploration time
  const [isExploring, setIsExploring] = useState(false);
  const [exploredTimeString, setExploredTimeString] = useState<string>("");
  const [exploredHoursVal, setExploredHoursVal] = useState<number | undefined>(undefined);
  const [exploredMinutesVal, setExploredMinutesVal] = useState<number | undefined>(undefined);

  // Sky options controls
  const [skyOptionsExpanded, setSkyOptionsExpanded] = useState(false);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>("auto");
  const [skyMotion, setSkyMotion] = useState(true);
  const [nightFireworks, setNightFireworks] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  // City Picker Dropdown / Search Modal
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Touch device detection
  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(hover: none)").matches || "ontouchstart" in window
    );
  }, []);

  // Panel smooth enter / exit transition management
  useEffect(() => {
    if (isOpen) {
      setPanelMounted(true);
      const rAF = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPanelVisible(true);
        });
      });
      return () => cancelAnimationFrame(rAF);
    } else {
      setPanelVisible(false);
      const timer = setTimeout(() => {
        setPanelMounted(false);
      }, prefersReducedMotion ? 0 : 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen, prefersReducedMotion]);

  // Initial Load & Geolocation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("open") === "true") setIsOpen(true);
      if (params.get("hover") === "true") setIsHovered(true);
    }

    const savedSound = localStorage.getItem("sky_sound_pref");
    if (savedSound === "unmuted") {
      setIsMuted(false);
      skySound.setMuted(false);
    }

    const savedVol = localStorage.getItem("sky_volume_pref");
    if (savedVol) {
      const v = parseFloat(savedVol);
      if (!isNaN(v)) {
        setVolume(v);
        skySound.setVolume(v);
      }
    }

    let cachedLocation: CityLocation | null = null;
    try {
      const stored = localStorage.getItem("sky_saved_location");
      if (stored) {
        cachedLocation = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    if (cachedLocation) {
      setLocation(cachedLocation);
      loadWeatherData(cachedLocation.latitude, cachedLocation.longitude);
    } else {
      const promptedBefore = localStorage.getItem("geo_permission_checked");
      if (!promptedBefore && typeof navigator !== "undefined" && "geolocation" in navigator) {
        localStorage.setItem("geo_permission_checked", "requested");
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
              const detectedCity = await reverseGeocode(lat, lon);
              setLocation(detectedCity);
              localStorage.setItem("sky_saved_location", JSON.stringify(detectedCity));
              loadWeatherData(lat, lon);
            } catch {
              loadWeatherData(PRESET_CITIES[0].latitude, PRESET_CITIES[0].longitude);
            }
          },
          () => {
            detectFallbackCity();
          },
          { timeout: 7000, maximumAge: 300000 }
        );
      } else {
        detectFallbackCity();
      }
    }
  }, []);

  const detectFallbackCity = () => {
    let visitorTz = "Asia/Kolkata";
    try {
      visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
    } catch {
      // fallback
    }
    const matched = PRESET_CITIES.find((c) => c.timezone === visitorTz);
    const chosen = matched || PRESET_CITIES[0];
    setLocation(chosen);
    localStorage.setItem("sky_saved_location", JSON.stringify(chosen));
    loadWeatherData(chosen.latitude, chosen.longitude);
  };

  // Fetch Weather Data
  const loadWeatherData = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch (err: any) {
      console.warn("Weather error:", err?.message);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Continuously update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      const formatted = formatTimeForZone(now, location.timezone);
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [location.timezone]);

  // Outside click and Escape key handler
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setCityPickerOpen(false);
        setSkyOptionsExpanded(false);
        setIsMobileRevealed(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setCityPickerOpen(false);
        setSkyOptionsExpanded(false);
        setIsMobileRevealed(false);
      }
    };

    if (isOpen || isMobileRevealed) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isMobileRevealed]);

  const selectCity = (city: CityLocation) => {
    setLocation(city);
    localStorage.setItem("sky_saved_location", JSON.stringify(city));
    setCityPickerOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    loadWeatherData(city.latitude, city.longitude);
    skySound.playTick();
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const geoInfo = await reverseGeocode(latitude, longitude);
          const userLoc: CityLocation = {
            name: geoInfo?.name || "Current Location",
            country: geoInfo?.country || "",
            latitude,
            longitude,
            timezone: geoInfo?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          };
          selectCity(userLoc);
        } catch (e) {
          console.warn("Geolocation reverse geocode error:", e);
        } finally {
          setIsSearching(false);
        }
      },
      () => {
        setIsSearching(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchCities(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    skySound.setMuted(nextMuted);
    localStorage.setItem("sky_sound_pref", nextMuted ? "muted" : "unmuted");
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    skySound.setVolume(v);
    localStorage.setItem("sky_volume_pref", v.toString());
  };

  // Weather Icon Helper
  const renderWeatherIcon = (
    iconType?: WeatherData["iconType"],
    isDay?: boolean,
    className: string = "w-5 h-5"
  ) => {
    if (weatherMode === "clear") {
      return isDay ? (
        <Sun className={`${className} text-amber-300 stroke-[2.2]`} />
      ) : (
        <Moon className={`${className} text-white stroke-[2.2] -rotate-[15deg]`} />
      );
    }
    if (weatherMode === "cloudy") {
      return <Cloud className={`${className} text-white stroke-[2.2]`} />;
    }
    if (weatherMode === "rain") {
      return <CloudRain className={`${className} text-blue-200 stroke-[2.2]`} />;
    }

    switch (iconType) {
      case "sun":
        return <Sun className={`${className} text-amber-300 stroke-[2.2]`} />;
      case "moon":
        return <Moon className={`${className} text-white stroke-[2.2] -rotate-[15deg]`} />;
      case "cloud-sun":
        return <CloudSun className={`${className} text-amber-200 stroke-[2.2]`} />;
      case "cloud-moon":
        return <CloudMoon className={`${className} text-white stroke-[2.2]`} />;
      case "cloud":
        return <Cloud className={`${className} text-white stroke-[2.2]`} />;
      case "rain":
        return <CloudRain className={`${className} text-blue-200 stroke-[2.2]`} />;
      case "drizzle":
        return <CloudDrizzle className={`${className} text-blue-200 stroke-[2.2]`} />;
      case "snow":
        return <CloudSnow className={`${className} text-white stroke-[2.2]`} />;
      case "thunder":
        return <CloudLightning className={`${className} text-amber-300 stroke-[2.2]`} />;
      case "fog":
        return <CloudFog className={`${className} text-white/80 stroke-[2.2]`} />;
      default:
        return isDay ? (
          <Sun className={`${className} text-amber-300 stroke-[2.2]`} />
        ) : (
          <Moon className={`${className} text-white stroke-[2.2] -rotate-[15deg]`} />
        );
    }
  };

  // Active time calculations
  const { hours, minutes } = getHoursMinutesForZone(currentTime, location.timezone);
  const activeHour = isExploring && exploredHoursVal !== undefined ? exploredHoursVal : hours;
  const activeMin = isExploring && exploredMinutesVal !== undefined ? exploredMinutesVal : minutes;
  const activeDecimalHour = activeHour + activeMin / 60;
  const isDaytime = activeHour >= 6 && activeHour < 18;

  // Sync with document element theme and dispatch real-time sky settings
  useEffect(() => {
    let cloudVal = 0.2;
    let rainVal = 0;
    let lightOverride: number | undefined = undefined;

    if (weatherMode === "auto") {
      const isCloudy = weather?.iconType?.includes("cloud");
      cloudVal = isCloudy ? 0.65 : weather?.weatherCode ? Math.min(1, weather.weatherCode * 0.2) : 0.2;
      rainVal = weather?.weatherCode && weather.weatherCode >= 51 ? 0.75 : 0;
    } else if (weatherMode === "clear") {
      cloudVal = 0.05;
      rainVal = 0;
    } else if (weatherMode === "cloudy") {
      cloudVal = 0.85;
      rainVal = 0;
    } else if (weatherMode === "rain") {
      cloudVal = 0.9;
      rainVal = 0.85;
      lightOverride = Math.min(isDaytime ? 0.5 : 0.1, 0.45);
    }

    const settings = getSkySettingsForHour(activeDecimalHour, {
      cloud: cloudVal,
      rain: rainVal,
      ...(lightOverride !== undefined ? { light: lightOverride } : {}),
      wind: skyMotion ? (weather?.windSpeed ? Math.min(12, weather.windSpeed) : 6) : 0,
    });

    dispatchSkyUpdate(settings);

    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--sky-top", settings.top);
      root.style.setProperty("--sky-mid", settings.bottom);
      root.style.setProperty("--sky-bottom", settings.bottom);
      root.style.setProperty("--sky-fallback-top", settings.top);
      root.style.setProperty("--sky-fallback-bottom", settings.bottom);
      root.style.setProperty("--theme-blend", isDaytime ? "1" : "0");
      root.style.setProperty("--daylight", isDaytime ? "1" : "0");

      // Set class="dark" so all Tailwind dark: classes activate cleanly!
      root.classList.toggle("dark", !isDaytime);
      if (isDaytime) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", "night");
      }
    }
  }, [activeDecimalHour, isDaytime, weather, weatherMode, skyMotion]);

  // Computed reveal state for collapsed pill
  const isRevealed = isHovered || isOpen || isMobileRevealed;

  const toggleOpen = () => {
    skySound.playTick();
    setIsOpen((prev) => !prev);
  };

  const handlePillBodyClick = () => {
    if (isTouchDevice) {
      skySound.playTick();
      setIsMobileRevealed((prev) => !prev);
    } else {
      toggleOpen();
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOpen();
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-4 right-4 sm:top-[33px] sm:right-[70px] z-50 flex flex-col items-end pointer-events-auto ${className}`}
    >
      {/* 
        1. TOP BAR: CIRCULAR SOUND BUTTON (LEFT) + WEATHER/TIME PILL (RIGHT)
        Matches Reference Image 2 & 3:
        [ 🔊 ]  [ 🌙 Ratnagiri · 8:45 PM  ⌃ ]
      */}
      <div className="flex items-center gap-2 select-none">
        {/* Separate Circular Sound Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute ambient sounds" : "Mute ambient sounds"}
          className={`w-[46px] h-[46px] sm:w-[48px] sm:h-[48px] rounded-full border backdrop-blur-2xl flex items-center justify-center transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-current/40 ${
            isDaytime
              ? "bg-white/45 hover:bg-white/60 border-white/50 text-[#142132] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
              : "bg-[#142033]/[0.65] hover:bg-[#18263c]/[0.75] border-white/[0.14] text-white shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
          }`}
          title={isMuted ? "Ambient sound muted (click to unmute)" : "Ambient sound playing"}
        >
          {isMuted ? (
            <VolumeX className="w-[18px] h-[18px] stroke-[2.2] opacity-60" />
          ) : (
            <Volume2 className="w-[18px] h-[18px] stroke-[2.2] text-current" />
          )}
        </button>

        {/* Collapsed Weather & Time Pill */}
        <div
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          className={`relative flex items-center h-[46px] sm:h-[48px] rounded-full border backdrop-blur-2xl font-sans px-4 sm:px-5 transition-all duration-300 group ${
            isDaytime
              ? "bg-white/45 hover:bg-white/60 border-white/50 text-[#142132] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
              : "bg-[#142033]/[0.65] hover:bg-[#18263c]/[0.75] border-white/[0.14] text-white shadow-[0_8px_32px_rgba(0,0,0,0.36)]"
          }`}
        >
          {/* Pill Trigger */}
          <button
            type="button"
            onClick={handlePillBodyClick}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            aria-expanded={isOpen}
            aria-controls="sky-weather-panel"
            aria-label={`Current location ${location.name}, weather and time widget`}
            className="inline-flex items-center gap-2.5 cursor-pointer outline-none rounded-full"
          >
            {/* Weather/Moon Icon */}
            <span className="shrink-0 flex items-center justify-center">
              {renderWeatherIcon(weather?.iconType, weather?.isDay ?? isDaytime, "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]")}
            </span>

            {/* City Reveal Container (Smooth expand to left) */}
            <span
              className={`grid ${
                prefersReducedMotion
                  ? "duration-0"
                  : "transition-[grid-template-columns,opacity,margin] duration-[260ms] ease-[cubic-bezier(0.2,0,0,1)]"
              } ${
                isRevealed
                  ? "grid-cols-[1fr] opacity-100 mr-0"
                  : "grid-cols-[0fr] opacity-0 -mr-2.5"
              }`}
              aria-hidden={!isRevealed}
            >
              <span className="min-w-0 overflow-hidden whitespace-nowrap inline-flex items-center gap-2">
                <span className={`text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] ${isDaytime ? "text-[#142132]" : "text-white"}`}>
                  {location.name}
                </span>
                <span className={`text-xs select-none ${isDaytime ? "text-[#142132]/40" : "text-white/40"}`}>·</span>
              </span>
            </span>

            {/* Time Display */}
            <span
              suppressHydrationWarning
              className={`text-[14px] sm:text-[15px] font-medium whitespace-nowrap tracking-tight tabular-nums ${
                isDaytime ? "text-[#142132]" : "text-white"
              }`}
            >
              {isExploring ? exploredTimeString : timeString}
            </span>
          </button>

          {/* Downward Chevron Button */}
          <button
            type="button"
            onClick={handleChevronClick}
            aria-expanded={isOpen}
            aria-controls="sky-weather-panel"
            aria-label={isOpen ? "Close weather and time panel" : "Open weather and time panel"}
            className={`p-1 -mr-1 cursor-pointer outline-none rounded-full ml-1 ${
              isDaytime ? "text-[#142132] hover:text-[#142132]/70" : "text-white hover:text-white/80"
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 shrink-0 stroke-[2.2] transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                isOpen ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* 
        2. EXPANDED CLIMATE PANEL
        Matches Reference Image 3:
        - Header: City selector (Ratnagiri ⌄) + Sound (🔊) + Close (✕)
        - Subheader: 🌙 Clear · 26° + Refresh (🔄)
        - Dial: 24-hr arc + triangular faceted pointer + 8:45 PM + Evening
        - Sky options ⌃:
          - Weather: [ Auto | ☀️ | ☁️ | 🌧️ ]
          - Sky motion: [ ON / OFF ]
          - Night fireworks: [ ON / OFF ]
          - Ambient sound: [ 🔊 ] slider [ ON / OFF ]
      */}
      {panelMounted && (
        <section
          id="sky-weather-panel"
          aria-label="Weather and time controls"
          className={`relative mt-[12px] w-[316px] max-w-[calc(100vw-32px)] max-h-[calc(100svh-100px)] rounded-[24px] backdrop-blur-2xl border overflow-y-auto px-5 py-4 flex flex-col justify-start origin-top-right select-none z-50 ${
            isDaytime
              ? "bg-white/80 border-white/60 text-[#142132] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              : "bg-[#131d2e]/[0.85] border-white/[0.12] text-white shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
          } ${
            prefersReducedMotion
              ? "duration-0"
              : "transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)]"
          } ${
            panelVisible
              ? "opacity-100 translate-y-0 scale-100"
              : isOpen
              ? "opacity-0 -translate-y-2 scale-[0.98]"
              : "opacity-0 -translate-y-1.5 scale-[0.98]"
          }`}
        >
          {/* Header: City Selector (Left) + Sound & Close Buttons (Right) */}
          <div className="flex items-center justify-between pb-1">
            {/* City Selector Trigger */}
            <button
              type="button"
              onClick={() => {
                setCityPickerOpen((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 text-lg font-medium tracking-tight transition-colors duration-150 cursor-pointer group ${
                isDaytime ? "text-[#142132] hover:text-[#142132]/70" : "text-white hover:text-white/80"
              }`}
              title="Change city"
            >
              <span>{location.name}</span>
              <ChevronDown
                className={`w-4 h-4 stroke-[2] transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                  cityPickerOpen ? "rotate-180" : "rotate-0"
                } ${isDaytime ? "text-[#142132]/80" : "text-white/80"}`}
              />
            </button>

            {/* Sound Toggle + Close Button */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleSound}
                className={`p-1.5 rounded-lg transition-colors duration-150 cursor-pointer ${
                  isDaytime ? "text-[#142132]/80 hover:text-[#142132] hover:bg-black/5" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title={isMuted ? "Enable sound" : "Mute sound"}
                aria-label={isMuted ? "Enable sound" : "Mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-[18px] h-[18px] stroke-[2] opacity-50" />
                ) : (
                  <Volume2 className="w-[18px] h-[18px] stroke-[2] opacity-100" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors duration-150 cursor-pointer ${
                  isDaytime ? "text-[#142132]/80 hover:text-[#142132] hover:bg-black/5" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="Close panel"
                aria-label="Close panel"
              >
                <X className="w-[18px] h-[18px] stroke-[2]" />
              </button>
            </div>
          </div>

          {/* City Selector Search Subpanel (Modal Overlay inside card) */}
          {cityPickerOpen && (
            <div className="absolute inset-x-3 top-12 bottom-3 rounded-2xl bg-[#0f1726]/95 border border-white/[0.12] p-3 space-y-2.5 backdrop-blur-xl z-20 flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any global city..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-sans text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              {/* Use My Location GPS */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 flex items-center justify-between text-xs font-sans transition-colors cursor-pointer text-blue-200"
              >
                <span>📍 Use my location</span>
                <span className="text-[10px] text-blue-300/70">GPS</span>
              </button>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {isSearching ? (
                  <div className="py-2.5 text-center text-xs text-white/50">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((city) => (
                    <button
                      key={`${city.latitude}-${city.longitude}-${city.name}`}
                      type="button"
                      onClick={() => selectCity(city)}
                      className="w-full px-2.5 py-1.5 rounded-md hover:bg-white/10 flex items-center justify-between text-xs font-sans text-left transition-colors cursor-pointer"
                    >
                      <span className="text-white">{city.name}</span>
                      <span className="text-[10px] text-white/50">{city.country}</span>
                    </button>
                  ))
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="py-2.5 text-center text-xs text-white/50">
                    No matching cities found.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {PRESET_CITIES.map((city) => {
                      const isSelected = city.name === location.name;
                      return (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => selectCity(city)}
                          className={`px-2 py-1.5 rounded-md text-xs font-sans text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-white/20 text-white font-medium"
                              : "hover:bg-white/10 text-white/80"
                          }`}
                        >
                          <span className="truncate">{city.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Condition Row: 🌙 Clear · 26° + Refresh Button (🔄) */}
          <div className={`flex items-center justify-between py-1 ${isDaytime ? "text-[#142132]" : "text-white"}`}>
            <div className="flex items-center gap-2">
              <span>{renderWeatherIcon(weather?.iconType, weather?.isDay ?? isDaytime, "w-[17px] h-[17px]")}</span>
              <span className={`text-[14px] font-sans ${isDaytime ? "text-[#142132]/90" : "text-white/90"}`}>
                {weatherMode === "clear"
                  ? "Clear"
                  : weatherMode === "cloudy"
                  ? "Cloudy"
                  : weatherMode === "rain"
                  ? "Rain"
                  : weather ? weather.description : "Clear"}{" "}
                · {weather ? `${weather.temperature}°` : "26°"}
              </span>
            </div>

            {/* Refresh Action */}
            <button
              type="button"
              onClick={() => {
                loadWeatherData(location.latitude, location.longitude);
                skySound.playTick();
              }}
              disabled={isLoadingWeather}
              className={`p-1 rounded-md transition-colors duration-150 cursor-pointer ${
                isDaytime ? "text-[#142132]/70 hover:text-[#142132] hover:bg-black/5" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title="Refresh weather"
            >
              <RotateCw className={`w-4 h-4 stroke-[2] ${isLoadingWeather ? "animate-spin text-current" : ""}`} />
            </button>
          </div>

          {/* Semicircular Clock Dial */}
          <div className="relative flex items-center justify-center my-1">
            <NightSkyDial
              realTimeHours={hours}
              realTimeMinutes={minutes}
              timeZone={location.timezone}
              skyOption="night"
              isDayWeather={weather?.isDay}
              onExploreChange={(exploring, expHours, expMinutes) => {
                setIsExploring(exploring);
                setExploredHoursVal(expHours);
                setExploredMinutesVal(expMinutes);
                if (exploring && expHours !== undefined && expMinutes !== undefined) {
                  const p = expHours >= 12 ? "PM" : "AM";
                  const h12 = expHours % 12 === 0 ? 12 : expHours % 12;
                  const mStr = expMinutes < 10 ? `0${expMinutes}` : expMinutes;
                  setExploredTimeString(`${h12}:${mStr} ${p}`);
                }
              }}
            />
          </div>

          {/* Sky options Accordion Trigger */}
          <div className={`pt-2 border-t ${isDaytime ? "border-black/[0.08]" : "border-white/[0.08]"}`}>
            <button
              type="button"
              onClick={() => {
                skySound.playTick();
                setSkyOptionsExpanded((prev) => !prev);
              }}
              aria-expanded={skyOptionsExpanded}
              className={`sky-options-trigger ${isDaytime ? "text-[#142132]/75 hover:text-[#142132]" : "text-white/80 hover:text-white"}`}
            >
              <span className="font-medium text-[13.5px]">Sky options</span>
              <ChevronDown
                className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                  skyOptionsExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          {/* Sky options Accordion Content (Matches Reference Image 3) */}
          <div
            className="sky-extra-options"
            data-open={skyOptionsExpanded}
          >
            <div className="sky-extra-options-content space-y-2 pt-2 pb-1">
              {/* Row 1: Weather -> Segmented [ Auto | ☀️ | ☁️ | 🌧️ ] */}
              <div className="sky-weather-options">
                <span className={`text-[13px] font-medium ${isDaytime ? "text-[#142132]/80" : "text-white/80"}`}>
                  Weather
                </span>
                <div className={`sky-segments ${isDaytime ? "day" : ""}`}>
                  <button
                    type="button"
                    className="sky-segment-btn"
                    aria-pressed={weatherMode === "auto"}
                    onClick={() => {
                      skySound.playTick();
                      setWeatherMode("auto");
                    }}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    className="sky-segment-btn"
                    aria-pressed={weatherMode === "clear"}
                    onClick={() => {
                      skySound.playTick();
                      setWeatherMode("clear");
                    }}
                    title="Clear"
                  >
                    ☀️
                  </button>
                  <button
                    type="button"
                    className="sky-segment-btn"
                    aria-pressed={weatherMode === "cloudy"}
                    onClick={() => {
                      skySound.playTick();
                      setWeatherMode("cloudy");
                    }}
                    title="Cloudy"
                  >
                    ☁️
                  </button>
                  <button
                    type="button"
                    className="sky-segment-btn"
                    aria-pressed={weatherMode === "rain"}
                    onClick={() => {
                      skySound.playTick();
                      setWeatherMode("rain");
                    }}
                    title="Rain"
                  >
                    🌧️
                  </button>
                </div>
              </div>

              {/* Row 2: Sky motion -> Toggle [ ON / OFF ] */}
              <div className="sky-motion-row">
                <span className={`text-[13px] font-medium ${isDaytime ? "text-[#142132]/80" : "text-white/80"}`}>
                  Sky motion
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={skyMotion}
                  onClick={() => {
                    skySound.playTick();
                    setSkyMotion((prev) => !prev);
                  }}
                  className={`sky-motion-switch ${isDaytime ? "day" : ""}`}
                  title={skyMotion ? "Sky motion enabled" : "Sky motion paused"}
                >
                  <span className="sky-motion-switch-thumb" />
                </button>
              </div>

              {/* Row 3: Night fireworks -> Toggle [ ON / OFF ] */}
              <div className="sky-motion-row">
                <span className={`text-[13px] font-medium ${isDaytime ? "text-[#142132]/80" : "text-white/80"}`}>
                  Night fireworks
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={nightFireworks}
                  onClick={() => {
                    skySound.playTick();
                    setNightFireworks((prev) => !prev);
                  }}
                  className={`sky-motion-switch ${isDaytime ? "day" : ""}`}
                  title={nightFireworks ? "Night fireworks enabled" : "Night fireworks disabled"}
                >
                  <span className="sky-motion-switch-thumb" />
                </button>
              </div>

              {/* Row 4: Ambient sound -> Volume slider + Toggle [ ON / OFF ] */}
              <div className="sky-motion-row">
                <span className={`text-[13px] font-medium ${isDaytime ? "text-[#142132]/80" : "text-white/80"}`}>
                  Ambient sound
                </span>
                <div className="sky-volume-control">
                  <button
                    type="button"
                    onClick={toggleSound}
                    className={`cursor-pointer ${isDaytime ? "text-[#142132]/70 hover:text-[#142132]" : "text-white/70 hover:text-white"}`}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5 opacity-50" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className={`sky-volume-slider ${isDaytime ? "day" : ""}`}
                    aria-label="Ambient volume"
                  />
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!isMuted}
                    onClick={toggleSound}
                    className={`sky-motion-switch ${isDaytime ? "day" : ""}`}
                    title={!isMuted ? "Ambient sound playing" : "Ambient sound muted"}
                  >
                    <span className="sky-motion-switch-thumb" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
