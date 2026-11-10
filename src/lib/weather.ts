export interface WeatherData {
  temperature: number;
  weatherCode: number;
  description: string;
  isDay: boolean;
  windSpeed: number;
  humidity?: number;
  iconType:
    | "sun"
    | "moon"
    | "cloud"
    | "cloud-sun"
    | "cloud-moon"
    | "rain"
    | "snow"
    | "thunder"
    | "fog"
    | "drizzle";
  updatedAt: string;
}

export interface CityLocation {
  id?: string | number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const PRESET_CITIES: CityLocation[] = [
  {
    name: "Ratnagiri",
    country: "India",
    latitude: 16.9902,
    longitude: 73.312,
    timezone: "Asia/Kolkata",
  },
  {
    name: "Mumbai",
    country: "India",
    latitude: 19.076,
    longitude: 72.8777,
    timezone: "Asia/Kolkata",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: "Asia/Dubai",
  },
  {
    name: "Bengaluru",
    country: "India",
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: "Asia/Kolkata",
  },
  {
    name: "Delhi",
    country: "India",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
  },
  {
    name: "London",
    country: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: "Europe/London",
  },
  {
    name: "New York",
    country: "United States",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
  },
  {
    name: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
  {
    name: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: "Asia/Singapore",
  },
  {
    name: "Paris",
    country: "France",
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: "Europe/Paris",
  },
  {
    name: "San Francisco",
    country: "United States",
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: "America/Los_Angeles",
  },
];

export function mapWmoCode(
  code: number,
  isDay: boolean = true
): { description: string; iconType: WeatherData["iconType"] } {
  switch (code) {
    case 0:
      return {
        description: "Clear sky",
        iconType: isDay ? "sun" : "moon",
      };
    case 1:
      return {
        description: isDay ? "Mainly clear" : "Clear starry sky",
        iconType: isDay ? "cloud-sun" : "cloud-moon",
      };
    case 2:
      return {
        description: "Partly cloudy",
        iconType: isDay ? "cloud-sun" : "cloud-moon",
      };
    case 3:
      return {
        description: "Overcast",
        iconType: "cloud",
      };
    case 45:
    case 48:
      return {
        description: "Foggy conditions",
        iconType: "fog",
      };
    case 51:
    case 53:
    case 55:
      return {
        description: "Light drizzle",
        iconType: "drizzle",
      };
    case 61:
    case 63:
    case 65:
      return {
        description: "Rain showers",
        iconType: "rain",
      };
    case 71:
    case 73:
    case 75:
      return {
        description: "Snowfall",
        iconType: "snow",
      };
    case 80:
    case 81:
    case 82:
      return {
        description: "Passing rain showers",
        iconType: "rain",
      };
    case 95:
    case 96:
    case 99:
      return {
        description: "Thunderstorm",
        iconType: "thunder",
      };
    default:
      return {
        description: isDay ? "Fair" : "Night sky",
        iconType: isDay ? "sun" : "moon",
      };
  }
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Weather service returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;
  if (!current) {
    throw new Error("Invalid response format from weather API");
  }

  const isDay = current.is_day === 1;
  const mapped = mapWmoCode(current.weather_code, isDay);

  return {
    temperature: Math.round(current.temperature_2m),
    weatherCode: current.weather_code,
    description: mapped.description,
    isDay,
    windSpeed: Math.round(current.wind_speed_10m || 0),
    humidity: current.relative_humidity_2m,
    iconType: mapped.iconType,
    updatedAt: new Date().toISOString(),
  };
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<CityLocation> {
  // Try BigDataCloud free client reverse geocoding first
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      const cityName =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        "My Location";
      const countryName = data.countryName || "India";

      // Derive timezone using browser or Intl
      let tz = "Asia/Kolkata";
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      } catch {
        // fallback
      }

      return {
        name: cityName,
        country: countryName,
        latitude,
        longitude,
        timezone: tz,
      };
    }
  } catch (err) {
    console.warn("Reverse geocode (BigDataCloud) failed, trying fallback:", err);
  }

  // Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "ArshinPortfolio/1.0",
      },
    });
    if (res.ok) {
      const data = await res.json();
      const address = data.address || {};
      const cityName =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        address.state ||
        "Local City";
      const countryName = address.country || "India";
      let tz = "Asia/Kolkata";
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      } catch {
        // fallback
      }
      return {
        name: cityName,
        country: countryName,
        latitude,
        longitude,
        timezone: tz,
      };
    }
  } catch (err) {
    console.warn("Nominatim fallback failed:", err);
  }

  // Default fallback
  return {
    name: "Ratnagiri",
    country: "India",
    latitude,
    longitude,
    timezone: "Asia/Kolkata",
  };
}

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: any) => ({
      id: r.id,
      name: r.name,
      country: r.country || "",
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone || "Asia/Kolkata",
    }));
  } catch (err) {
    console.error("Geocoding search failed:", err);
    return [];
  }
}

export function formatTimeForZone(
  date: Date,
  timeZone: string,
  includeSeconds: boolean = false
): string {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: true,
    });
  } catch {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: true,
    });
  }
}

export function getHoursMinutesForZone(
  date: Date,
  timeZone: string
): { hours: number; minutes: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(date);

    let hours = date.getHours();
    let minutes = date.getMinutes();

    for (const part of parts) {
      if (part.type === "hour") hours = parseInt(part.value, 10);
      if (part.type === "minute") minutes = parseInt(part.value, 10);
    }
    return { hours, minutes };
  } catch {
    return { hours: date.getHours(), minutes: date.getMinutes() };
  }
}
