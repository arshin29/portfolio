"use client";

import { useState } from "react";
import {
  FileText,
  Bot,
  Upload,
  CheckCircle2,
  Database,
  Sparkles,
  Search,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function DocuMindPreview() {
  const [selectedDoc, setSelectedDoc] = useState<string>("arch");
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const docs = [
    {
      id: "arch",
      name: "System_Architecture_Specs.pdf",
      pages: "16 pages",
      size: "2.4 MB",
      status: "Indexed",
      date: "Nov 02",
      tag: "Architecture",
    },
    {
      id: "schema",
      name: "Database_Schema_v2.pdf",
      pages: "8 pages",
      size: "1.1 MB",
      status: "Indexed",
      date: "Oct 28",
      tag: "PostgreSQL",
    },
    {
      id: "api",
      name: "API_Security_Guidelines.pdf",
      pages: "12 pages",
      size: "1.8 MB",
      status: "Indexed",
      date: "Oct 24",
      tag: "Security",
    },
  ];

  const queries = [
    {
      q: "Explain the backend API authorization model and token lifecycle.",
      a: "The API uses stateless JWT authentication with dual-token rotation (15m access token, 7d refresh token stored in HTTP-only cookies). All protected endpoints under /api/v1 validate token signatures and verify role permissions through structured backend middleware.",
      sources: ["Section 2.4 — Token Refresh Pipeline", "Section 3.1 — Role Guards"],
    },
    {
      q: "How does the document chunking and indexing pipeline work?",
      a: "Uploaded PDFs are streamed to the Node.js backend, decomposed into raw text streams with layout preservation, partitioned into 500-token chunks with 50-token overlaps, and stored in PostgreSQL with indexed embeddings for fast semantic retrieval.",
      sources: ["Section 4.2 — Ingestion Workflow", "Appendix B — Database Tables"],
    },
  ];

  const handleSelectQuery = (index: number) => {
    setIsProcessing(true);
    setActiveQuestion(index);
    setTimeout(() => {
      setIsProcessing(false);
    }, 250);
  };

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
            documind.workspace/documents
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50">
            <Sparkles className="w-3 h-3 text-purple-400" /> AI Engine: Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300">
            <Database className="w-3 h-3 text-blue-400" /> PostgreSQL Architecture
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
        {/* Left: Document Management List (4 cols) */}
        <div className="md:col-span-4 p-3.5 bg-neutral-950/50 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-200">
                  Documents
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  3 PDFs
                </span>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
              >
                <Upload className="w-3 h-3" /> Upload PDF
              </button>
            </div>

            {/* Document list */}
            <div className="space-y-1.5">
              {docs.map((d) => {
                const isSelected = selectedDoc === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDoc(d.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-neutral-800/90 border-blue-500/40 text-neutral-100"
                        : "bg-neutral-900/50 border-neutral-800/70 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isSelected ? "text-blue-400" : "text-neutral-500"
                    }`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-neutral-100">
                        {d.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>{d.pages}</span>
                        <span>•</span>
                        <span>{d.size}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">{d.status}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload and Processing summary */}
          <div className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400">
            <div className="flex items-center justify-between text-neutral-300 mb-1">
              <span className="font-medium">Ingestion Pipeline</span>
              <span className="text-emerald-400 font-mono">Ready</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              PDF Parser → Chunk Normalizer → Embedding Generator → DB Vector Index
            </div>
          </div>
        </div>

        {/* Right: AI-Assisted Document Interaction & Query Panel (8 cols) */}
        <div className="md:col-span-8 p-4 bg-neutral-900/80 flex flex-col justify-between space-y-4">
          <div>
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium text-neutral-200">
                  {docs.find((d) => d.id === selectedDoc)?.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  18 Chunks Parsed
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>API Authenticated</span>
              </div>
            </div>

            {/* Interactive Query Selector */}
            <div className="mt-3">
              <div className="text-[11px] text-neutral-400 uppercase font-mono tracking-wider mb-2">
                Ask Questions About Document
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {queries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuery(idx)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 ${
                      activeQuestion === idx
                        ? "bg-blue-600/15 border border-blue-500/30 text-blue-300 font-medium"
                        : "bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300"
                    }`}
                  >
                    <span className="truncate">{item.q}</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 text-neutral-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Display */}
            <div className="mt-4 p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80 relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-neutral-200">
                  AI Context Response
                </span>
                <span className="text-[10px] font-mono text-neutral-500 ml-auto">
                  Stream latency: 42ms
                </span>
              </div>

              {isProcessing ? (
                <div className="py-6 text-center text-xs text-neutral-400 animate-pulse font-mono">
                  Synthesizing document chunks...
                </div>
              ) : (
                <>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {queries[activeQuestion].a}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-neutral-800/70 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">
                      Citations:
                    </span>
                    {queries[activeQuestion].sources.map((src, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-blue-400"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mock prompt input */}
          <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs">
            <input
              type="text"
              readOnly
              value="Ask custom query across uploaded PDF corpus..."
              className="bg-transparent text-neutral-400 focus:outline-none flex-1 text-xs"
            />
            <button
              type="button"
              className="p-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Bar */}
      <div className="px-4 py-2 bg-neutral-950/90 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Stack: Next.js + Node.js</span>
          <span>•</span>
          <span>DB: PostgreSQL Schemas</span>
          <span>•</span>
          <span>Processing: PDF Ingestion Engine</span>
        </div>
        <div className="text-neutral-500 hidden sm:inline">
          Architectural Highlight: Automated PDF Parsing & AI Context Retrieval
        </div>
      </div>
    </div>
  );
}
