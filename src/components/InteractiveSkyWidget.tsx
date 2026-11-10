"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Time tracking
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeString, setTimeString] = useState<string>("2:34 AM");

  // Exploration time
  const [isExploring, setIsExploring] = useState(false);
  const [exploredTimeString, setExploredTimeString] = useState<string>("");

  // Sky options & audio
  const [skyOption, setSkyOption] = useState<SkyOption>("night");
  const [skyOptionsExpanded, setSkyOptionsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  // Initial Load & Geolocation on First Visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("open") === "true") setIsOpen(true);
      if (params.get("hover") === "true") setIsHovered(true);
    }

    const savedSky = localStorage.getItem("sky_option_pref") as SkyOption | null;
    if (savedSky && ["night", "dawn", "day", "dusk"].includes(savedSky)) {
      setSkyOption(savedSky);
    }

    const savedSound = localStorage.getItem("sky_sound_pref");
    if (savedSound === "unmuted") {
      setIsMuted(false);
      skySound.setMuted(false);
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
          (err) => {
            console.log("Geolocation permission error:", err.message);
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

  // Fetch Real Weather Data
  const loadWeatherData = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
    } catch (err: any) {
      console.warn("Weather error:", err?.message);
      setWeatherError("Unavailable");
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

  const selectSkyOption = (opt: SkyOption) => {
    setSkyOption(opt);
    localStorage.setItem("sky_option_pref", opt);
    skySound.playTick();
  };

  // Weather Icon Helper
  const renderWeatherIcon = (
    iconType?: WeatherData["iconType"],
    isDay?: boolean,
    className: string = "w-5 h-5"
  ) => {
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

  const { hours, minutes } = getHoursMinutesForZone(currentTime, location.timezone);

  // Computed reveal state (smooth horizontal expansion to the left)
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
        1. COLLAPSED FLOATING PILL
        - Initially shows weather/moon icon, current local time and downward chevron.
        - On hover (or tap on mobile), smoothly reveals city name to the left of time.
        - Expands horizontally towards the left via items-end, keeping its right edge fixed.
        - On pointer leave, smoothly returns to compact state with cubic-bezier(0.2, 0, 0, 1).
      */}
      <div
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        className="relative flex items-center h-[48px] sm:h-[50px] rounded-full bg-[#162133]/[0.55] hover:bg-[#1a283e]/[0.65] border border-white/[0.14] hover:border-white/[0.22] backdrop-blur-xl font-sans text-white px-4 sm:px-5 transition-colors duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.36)] select-none group"
      >
        {/* Pill Content Trigger (Icon + City + Time) */}
        <button
          type="button"
          onClick={handlePillBodyClick}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          aria-expanded={isOpen}
          aria-controls="sky-weather-panel"
          aria-label={`Current location ${location.name}, weather and time widget`}
          className="inline-flex items-center gap-2.5 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-full"
        >
          {/* Weather/Moon Icon */}
          <span className="shrink-0 flex items-center justify-center">
            {renderWeatherIcon(weather?.iconType, weather?.isDay, "w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]")}
          </span>

          {/* Smooth City Reveal Container (0fr -> 1fr grid transition) */}
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
              <span className="text-[14px] sm:text-[15px] font-medium text-white tracking-[-0.01em]">
                {location.name}
              </span>
              <span className="text-white/40 text-xs select-none">·</span>
            </span>
          </span>

          {/* Time Display */}
          <span
            suppressHydrationWarning
            className="text-[14px] sm:text-[15px] font-medium text-white whitespace-nowrap tracking-tight tabular-nums"
          >
            {isExploring ? exploredTimeString : timeString}
          </span>
        </button>

        {/* Downward Chevron Button (Opens climate panel directly beneath pill, rotates 180deg) */}
        <button
          type="button"
          onClick={handleChevronClick}
          aria-expanded={isOpen}
          aria-controls="sky-weather-panel"
          aria-label={isOpen ? "Close weather and time panel" : "Open weather and time panel"}
          className="p-1 -mr-1 text-white hover:text-white/80 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-full ml-1"
        >
          <ChevronDown
            className={`w-4 h-4 text-white shrink-0 stroke-[2.2] ${
              prefersReducedMotion
                ? "duration-0"
                : "transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)]"
            } ${isOpen ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 
        2. EXPANDED CLIMATE PANEL
        - Opens directly beneath pill, aligned with pill's right edge.
        - Animated with subtle fade-in and vertical movement (initial: opacity 0, y: -8px, scale: 0.98 -> opacity 1, y: 0, scale: 1).
        - Closes smoothly with reverse animation (exit: opacity 0, y: -6px, scale: 0.98).
        - Easing matches reference: cubic-bezier(0.2, 0, 0, 1), duration 220ms.
      */}
      {panelMounted && (
        <section
          id="sky-weather-panel"
          aria-label="Weather and time controls"
          className={`relative mt-[12px] w-[326px] max-w-[calc(100vw-32px)] h-[343px] rounded-[23px] bg-[#131d2e]/[0.72] backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden text-white px-6 py-5 flex flex-col justify-between origin-top-right select-none z-50 ${
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
          <div className="flex items-center justify-between">
            {/* City Selector Trigger */}
            <button
              type="button"
              onClick={() => {
                setCityPickerOpen((prev) => !prev);
                setSkyOptionsExpanded(false);
              }}
              className="inline-flex items-center gap-1.5 text-xl font-medium tracking-tight text-white hover:text-white/80 transition-colors duration-150 cursor-pointer group"
              title="Change city"
            >
              <span>{location.name}</span>
              <ChevronDown
                className={`w-4 h-4 text-white/80 stroke-[2] transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                  cityPickerOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Sound Toggle + Close Button */}
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={toggleSound}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                title={isMuted ? "Enable sound" : "Mute sound"}
                aria-label={isMuted ? "Enable sound" : "Mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="w-[18px] h-[18px] stroke-[2] opacity-50 transition-opacity" />
                ) : (
                  <Volume2 className="w-[18px] h-[18px] stroke-[2] opacity-100 text-white transition-opacity" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                title="Close panel"
                aria-label="Close panel"
              >
                <X className="w-[18px] h-[18px] stroke-[2]" />
              </button>
            </div>
          </div>

          {/* City Selector Search Subpanel (Modal/Overlay inside card) */}
          {cityPickerOpen && (
            <div className="absolute inset-x-4 top-13 bottom-4 rounded-2xl bg-[#0f1726]/95 border border-white/[0.12] p-3 space-y-2.5 backdrop-blur-xl z-20 flex flex-col animate-in fade-in zoom-in-95 duration-200">
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

          {/* Weather Row: Icon + "Clear sky · 24°" (Left) + Refresh Button (Right) */}
          <div className="flex items-center justify-between text-white -mt-0.5">
            <div className="flex items-center gap-2">
              <span>{renderWeatherIcon(weather?.iconType, weather?.isDay, "w-[17px] h-[17px]")}</span>
              <span className="text-[14px] font-sans text-white/90">
                {weather ? weather.description : "Clear sky"} · {weather ? `${weather.temperature}°` : "24°"}
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
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer"
              title="Refresh weather"
            >
              <RotateCw className={`w-4 h-4 stroke-[2] ${isLoadingWeather ? "animate-spin text-white" : ""}`} />
            </button>
          </div>

          {/* Interactive Semicircular Clock Dial */}
          <div className="relative flex items-center justify-center -my-0.5">
            <NightSkyDial
              realTimeHours={hours}
              realTimeMinutes={minutes}
              timeZone={location.timezone}
              skyOption={skyOption}
              isDayWeather={weather?.isDay}
              onExploreChange={(exploring, expHours, expMinutes) => {
                setIsExploring(exploring);
                if (exploring && expHours !== undefined && expMinutes !== undefined) {
                  const p = expHours >= 12 ? "PM" : "AM";
                  const h12 = expHours % 12 === 0 ? 12 : expHours % 12;
                  const mStr = expMinutes < 10 ? `0${expMinutes}` : expMinutes;
                  setExploredTimeString(`${h12}:${mStr} ${p}`);
                }
              }}
            />
          </div>

          {/* Bottom Collapsible Row: Sky options ⌄ */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSkyOptionsExpanded((prev) => !prev);
                setCityPickerOpen(false);
                skySound.playTick();
              }}
              className="inline-flex items-center gap-1.5 text-[13px] font-sans font-medium text-white/80 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              <span>Sky options</span>
              <ChevronDown
                className={`w-3.5 h-3.5 stroke-[2.2] transition-transform duration-[220ms] ease-[cubic-bezier(0.2,0,0,1)] ${
                  skyOptionsExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          {/* Sky Options Overlay inside card */}
          {skyOptionsExpanded && (
            <div className="absolute inset-x-4 bottom-14 rounded-xl bg-[#0f1726]/95 border border-white/[0.12] p-2 grid grid-cols-4 gap-1.5 backdrop-blur-xl z-20 animate-in fade-in zoom-in-95 duration-200">
              {(["night", "dawn", "day", "dusk"] as SkyOption[]).map((opt) => {
                const isActive = skyOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectSkyOption(opt)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-sans capitalize transition-all cursor-pointer text-center ${
                      isActive
                        ? "bg-white/25 text-white font-medium border border-white/30"
                        : "bg-white/10 text-white/70 hover:text-white hover:bg-white/15 border border-transparent"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
