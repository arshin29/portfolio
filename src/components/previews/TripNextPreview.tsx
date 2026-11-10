"use client";

import { useState } from "react";
import {
  Compass,
  MapPin,
  Heart,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Database,
  Navigation,
} from "lucide-react";

export default function TripNextPreview() {
  const [activeTab, setActiveTab] = useState<"discovery" | "itinerary">("discovery");
  const [savedItems, setSavedItems] = useState<string[]>(["amalfi", "kyoto"]);
  const [filter, setFilter] = useState<"all" | "coastal" | "cultural" | "alpine">("all");

  const toggleSave = (id: string) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const destinations = [
    {
      id: "amalfi",
      title: "Amalfi Coast & Positano",
      country: "Italy",
      tag: "coastal",
      tagLabel: "Coastal Discovery",
      duration: "4 Days · 12 Coordinates",
      stops: "Positano Clifftop · Ravello Gardens · Ferriere Valley",
      latLng: "40.6340° N, 14.6027° E",
      rating: "4.94",
    },
    {
      id: "kyoto",
      title: "Kyoto Heritage Trail",
      country: "Japan",
      tag: "cultural",
      tagLabel: "Cultural & Historic",
      duration: "3 Days · 9 Coordinates",
      stops: "Arashiyama Grove · Fushimi Inari · Higashiyama",
      latLng: "35.0116° N, 135.7681° E",
      rating: "4.98",
    },
    {
      id: "zermatt",
      title: "Matterhorn Glacier Circuit",
      country: "Switzerland",
      tag: "alpine",
      tagLabel: "High Alpine",
      duration: "5 Days · Elevation +1420m",
      stops: "Gornergrat Viewpoint · Five Lakes Trail · Hörnli Hut",
      latLng: "45.9765° N, 7.7491° E",
      rating: "4.89",
    },
  ];

  const filtered = destinations.filter(
    (d) => filter === "all" || d.tag === filter
  );

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0c1524] text-neutral-100 shadow-xl font-sans">
      {/* App Header / Mock Browser Chrome */}
      <div className="px-4 py-2.5 bg-[#080e18] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700 inline-block" />
          </div>
          <span className="text-neutral-500 font-mono ml-2 hidden sm:inline">
            tripnext.app/explore
          </span>
        </div>

        {/* Auth status indicator */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
            <Lock className="w-3 h-3" /> Auth: JWT Valid (Arshin B.)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300">
            <Database className="w-3 h-3 text-blue-400" /> PostgreSQL
          </span>
        </div>
      </div>

      {/* App Navigation Bar */}
      <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            TripNext
          </span>
          <span className="text-neutral-500 text-xs hidden md:inline">
            / Full-Stack Travel Planner
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab("discovery")}
            className={`px-3 py-1 rounded-md transition-all font-medium ${
              activeTab === "discovery"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Discovery & Save
          </button>
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              activeTab === "itinerary"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Calendar className="w-3 h-3" /> Itinerary Builder
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === "discovery" ? (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Search and Category Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-neutral-400">Search destinations, regions, tags...</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "coastal", label: "Coastal" },
                  { key: "cultural", label: "Cultural" },
                  { key: "alpine", label: "Alpine" },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    filter === t.key
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {filtered.map((dest) => {
              const isSaved = savedItems.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  className="bg-neutral-950/80 rounded-lg border border-neutral-800/80 p-3.5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-950/50 border border-blue-900/40 px-2 py-0.5 rounded">
                        {dest.tagLabel}
                      </span>
                      <button
                        onClick={() => toggleSave(dest.id)}
                        className={`p-1.5 rounded hover:bg-neutral-800 transition-colors ${
                          isSaved ? "text-rose-400" : "text-neutral-500"
                        }`}
                        title={isSaved ? "Remove from saved" : "Save destination"}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <h4 className="font-semibold text-neutral-100 text-sm">
                      {dest.title}
                    </h4>
                    <p className="text-neutral-400 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {dest.country} · {dest.latLng}
                    </p>

                    <div className="my-2.5 p-2 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300">
                      <div className="text-neutral-400 text-[10px] uppercase font-mono tracking-wider">
                        Key Points
                      </div>
                      <div className="mt-0.5 truncate">{dest.stops}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{dest.duration}</span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {isSaved ? "Saved" : "Available"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Itinerary & Map View */
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-medium text-neutral-200">
                Active Itinerary: Amalfi Coast (4 Days)
              </span>
              <span className="font-mono text-[11px] text-blue-400">
                DB ID: #TRP-8492
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between text-neutral-300 font-medium">
                  <span className="text-blue-400 font-mono">Day 1</span>
                  <span className="text-[11px] text-neutral-500">10:00 - 15:30</span>
                </div>
                <div className="text-neutral-100 font-medium mt-1">
                  Arrive at Positano Harbour & Ferry Intake
                </div>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Check-in, coastal cliff path survey, luggage transport.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between text-neutral-300 font-medium">
                  <span className="text-blue-400 font-mono">Day 2</span>
                  <span className="text-[11px] text-neutral-500">08:30 - 14:00</span>
                </div>
                <div className="text-neutral-100 font-medium mt-1">
                  Path of the Gods (Sentiero degli Dei) Trek
                </div>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  7.8km hike from Bomerano to Nocelle with map elevation checkpoints.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between text-neutral-300 font-medium">
                  <span className="text-blue-400 font-mono">Day 3</span>
                  <span className="text-[11px] text-neutral-500">11:00 - 18:00</span>
                </div>
                <div className="text-neutral-100 font-medium mt-1">
                  Ravello Gardens & Villa Cimbrone Terrace
                </div>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Cliff terrace overlooks, historical botanical path.
                </p>
              </div>
            </div>
          </div>

          {/* Map Simulation Panel */}
          <div className="bg-neutral-950 rounded-lg border border-neutral-800 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
              <span className="inline-flex items-center gap-1.5 text-neutral-300 font-medium">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Map Integration & Coordinates
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                Leaflet / LatLng
              </span>
            </div>

            {/* Stylized schematic map */}
            <div className="my-4 py-6 px-4 bg-neutral-900/60 rounded border border-neutral-800/80 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative flex flex-col gap-3 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Node A: Positano Clifftop (40.6281° N, 14.4850° E)</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-blue-600/40 ml-1" />
                <div className="flex items-center gap-2 text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Node B: Path of the Gods (40.6358° N, 14.5386° E)</span>
                </div>
                <div className="h-4 border-l-2 border-dashed border-blue-600/40 ml-1" />
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Node C: Ravello Villa (40.6492° N, 14.6119° E)</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-800">
              <span>Full-stack Sync: 3 Nodes Saved</span>
              <span className="text-emerald-400 font-mono">Status: 200 OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Technical Status Bar */}
      <div className="px-4 py-2 bg-neutral-950/90 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Stack: Next.js + Node.js</span>
          <span>•</span>
          <span>DB: PostgreSQL</span>
          <span>•</span>
          <span>Auth: JWT Session</span>
        </div>
        <div className="text-neutral-500 hidden sm:inline">
          Architectural Highlight: Decoupled Full-Stack System
        </div>
      </div>
    </div>
  );
}
