"use client";

import { useState } from "react";
import {
  Package,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Edit2,
  Trash2,
  Database,
  Clock,
  Layers,
  Check,
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  minThreshold: number;
  price: string;
  status: "In Stock" | "Low Stock" | "Critical";
}

export default function StocklyPreview() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"stock" | "name" | "price">("stock");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      sku: "STK-9014",
      name: "Ultra-Fast NVMe SSD 1TB",
      category: "Storage",
      stock: 4,
      minThreshold: 10,
      price: "$109.00",
      status: "Low Stock",
    },
    {
      id: "2",
      sku: "STK-4421",
      name: "Mechanical Key Switch Module (Tactile)",
      category: "Peripherals",
      stock: 2,
      minThreshold: 15,
      price: "$24.50",
      status: "Critical",
    },
    {
      id: "3",
      sku: "STK-1188",
      name: "USB-C Dual 4K Display Adapter",
      category: "Electronics",
      stock: 64,
      minThreshold: 20,
      price: "$68.00",
      status: "In Stock",
    },
    {
      id: "4",
      sku: "STK-8032",
      name: "Cat6A Shielded Ethernet Cable 15m",
      category: "Networking",
      stock: 120,
      minThreshold: 25,
      price: "$18.50",
      status: "In Stock",
    },
    {
      id: "5",
      sku: "STK-3319",
      name: "GaN Fast Charger 100W Dual Port",
      category: "Electronics",
      stock: 9,
      minThreshold: 15,
      price: "$45.00",
      status: "Low Stock",
    },
  ]);

  const handleAdjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          let newStatus: "In Stock" | "Low Stock" | "Critical" = "In Stock";
          if (newStock <= 3) newStatus = "Critical";
          else if (newStock <= item.minThreshold) newStatus = "Low Stock";
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );
    setFeedbackMsg(`CRUD Mutation: Stock updated via PATCH /api/v1/inventory`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const filtered = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "stock") return a.stock - b.stock;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""));
    });

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
            stockly.internal/dashboard
          </span>
        </div>

        {/* In Progress Status Flag */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-950/70 text-amber-300 border border-amber-800/60 font-semibold animate-pulse">
            <Clock className="w-3 h-3" /> Status: In Progress
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300">
            <Database className="w-3 h-3 text-blue-400" /> PostgreSQL + Prisma
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* KPI metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Total SKUs
            </div>
            <div className="text-lg font-semibold text-neutral-100 mt-0.5">
              1,420
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Indexed in PostgreSQL</div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
              Low Stock Alerts
            </div>
            <div className="text-lg font-semibold text-amber-300 mt-0.5">
              8 Items
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Below reorder trigger</div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Prisma Migration
            </div>
            <div className="text-sm font-mono font-medium text-blue-400 mt-1 truncate">
              04_stock_indices
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Applied to DB</div>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              REST Endpoints
            </div>
            <div className="text-sm font-mono font-medium text-neutral-300 mt-1">
              /api/v1/inventory
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">CRUD Operations Active</div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Sort */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by SKU or Product Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-neutral-200 placeholder-neutral-500 focus:outline-none w-full text-xs"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 sm:pb-0">
            {["All", "Storage", "Peripherals", "Electronics", "Networking"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() =>
                setSortBy((prev) =>
                  prev === "stock" ? "price" : prev === "price" ? "name" : "stock"
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 hover:text-white"
            >
              <ArrowUpDown className="w-3 h-3 text-neutral-400" />
              <span>Sort: {sortBy}</span>
            </button>
          </div>
        </div>

        {/* Feedback alert on CRUD mutation */}
        {feedbackMsg && (
          <div className="px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-lg border border-neutral-800 overflow-x-auto bg-neutral-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px] bg-neutral-900/60">
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Category</th>
                <th className="py-2.5 px-3">Stock Count</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Quick CRUD Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-neutral-900/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-[11px] text-blue-400">
                    {item.sku}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-neutral-200">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-400 hidden sm:table-cell">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-neutral-200">
                    {item.stock} units
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        item.status === "In Stock"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                          : item.status === "Low Stock"
                          ? "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                          : "bg-rose-950/60 text-rose-300 border border-rose-800/50"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-neutral-300 text-right">
                    {item.price}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustStock(item.id, -1)}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        title="Decrement stock (-1)"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, +5)}
                        className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-[11px]"
                        title="Restock (+5)"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Technical Status Bar */}
      <div className="px-4 py-2 bg-neutral-950/90 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Stack: React + Node.js</span>
          <span>•</span>
          <span>ORM: Prisma</span>
          <span>•</span>
          <span>DB: PostgreSQL</span>
        </div>
        <div className="text-amber-400 font-semibold flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          Active Development Phase
        </div>
      </div>
    </div>
  );
}
