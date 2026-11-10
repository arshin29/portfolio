"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  PenLine,
  X,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form visibility state (initially hidden)
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Social icons reveal state
  const [isSocialHovered, setIsSocialHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("form") === "open" || p.get("open") === "true") setIsFormOpen(true);
      if (p.get("social") === "true") setIsSocialHovered(true);
    }
  }, []);

  const recipientEmail = "arshinbhande29@gmail.com";

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please write a short message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Failed to deliver message. Please try again."
        );
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while sending your message.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    const formatted = `To: ${recipientEmail}\nFrom: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    setSubmitted(false);
    setSubmitError(null);
    setErrors({});
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-32 scroll-mt-16 sm:scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact Introduction (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8fa4bf] mb-4">
                Contact
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-[-0.04em] text-[#f6f8fd] leading-[1.08]">
                Your move.
              </h2>

              <div className="mt-4 space-y-1.5 sm:space-y-2">
                <p className="text-lg sm:text-xl text-[#a9bad1] font-normal tracking-[-0.015em] leading-relaxed">
                  Got an interesting idea or something worth creating together?
                </p>
                <p className="text-lg sm:text-xl text-[#a9bad1] font-normal tracking-[-0.015em] leading-relaxed">
                  Drop me a note.
                </p>
                <p className="text-lg sm:text-xl text-[#a9bad1] font-normal tracking-[-0.015em] leading-relaxed">
                  Let&apos;s make it happen.
                </p>
              </div>

              {/* "Write a note" Button + Social Reveal on Hover */}
              <div
                className="mt-8 flex flex-wrap items-center gap-3 relative"
                onMouseEnter={() => setIsSocialHovered(true)}
                onMouseLeave={() => setIsSocialHovered(false)}
              >
                {/* Prominent Rounded Pill Button */}
                <button
                  type="button"
                  onClick={() => setIsFormOpen((prev) => !prev)}
                  aria-expanded={isFormOpen}
                  aria-controls="contact-form-panel"
                  className="h-12 px-6 rounded-full bg-[#182335]/[0.60] hover:bg-[#202d44]/[0.72] border border-white/[0.14] hover:border-white/[0.24] backdrop-blur-xl text-white font-medium text-sm sm:text-base inline-flex items-center gap-3 transition-all duration-200 shadow-[0_4px_24px_rgba(0,0,0,0.3)] cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <span>Write a note</span>
                  <PenLine className="w-4 h-4 text-white/90 group-hover:text-white transition-transform group-hover:scale-110" />
                </button>

                {/* Social/Contact Buttons: LinkedIn, Instagram, Mail (in exact order) */}
                <div
                  className={`flex items-center gap-2.5 transition-all duration-300 ease-out ${
                    isSocialHovered
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 -translate-x-3 pointer-events-none"
                  }`}
                >
                  {/* 1. LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/arshin-akil-82843532b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    aria-label="LinkedIn profile (Arshin Akil)"
                    className="w-12 h-12 rounded-full bg-[#182335]/[0.60] hover:bg-[#202d44]/[0.75] border border-white/[0.14] hover:border-white/[0.24] backdrop-blur-xl flex items-center justify-center text-white/90 hover:text-white transition-all shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_28px_rgba(0,0,0,0.45)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.05 1.53 1.53 0 0 0 0 3.05m1.39 9.74v-8.37H5.07v8.37z" />
                    </svg>
                  </a>

                  {/* 2. Instagram */}
                  <a
                    href="https://www.instagram.com/arshin_akil/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    aria-label="Instagram profile (@arshin_akil)"
                    className="w-12 h-12 rounded-full bg-[#182335]/[0.60] hover:bg-[#202d44]/[0.75] border border-white/[0.14] hover:border-white/[0.24] backdrop-blur-xl flex items-center justify-center text-white/90 hover:text-white transition-all shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_28px_rgba(0,0,0,0.45)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>

                  {/* 3. Email */}
                  <a
                    href={`mailto:${recipientEmail}`}
                    title="Email"
                    aria-label="Email"
                    className="w-12 h-12 rounded-full bg-[#182335]/[0.60] hover:bg-[#202d44]/[0.75] border border-white/[0.14] hover:border-white/[0.24] backdrop-blur-xl flex items-center justify-center text-white/90 hover:text-white transition-all shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_28px_rgba(0,0,0,0.45)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Mail className="w-4 h-4 stroke-[2]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Links */}
            <div className="mt-10 lg:mt-14 space-y-5 pt-8 border-t border-white/[0.08]">
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-[#64748b] mb-1">
                  Email
                </span>
                <a
                  href={`mailto:${recipientEmail}`}
                  className="group inline-flex items-center gap-1.5 text-sm sm:text-base text-[#f6f8fd] hover:text-white transition-colors"
                >
                  <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-white">
                    {recipientEmail}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8fa4bf] group-hover:text-white transition-colors" />
                </a>
              </div>

              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-[#64748b] mb-1">
                  GitHub
                </span>
                <a
                  href="https://github.com/arshin29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-sm sm:text-base text-[#f6f8fd] hover:text-white transition-colors"
                >
                  <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-white">
                    github.com/arshin29
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8fa4bf] group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (Completely Empty Initially, Reveals on "Write a note" click) */}
          <div className="lg:col-span-7" id="contact-form-panel">
            {isFormOpen && (
              <div className="relative rounded-2xl bg-[#111c2f]/75 border border-white/[0.09] p-8 sm:p-10 lg:p-11 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-sm text-[#f6f8fd] animate-in fade-in slide-in-from-top-3 duration-300">
                {/* Form Header with Close Button */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.08]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8fa4bf]">
                    Message
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="p-1.5 -mr-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Close form"
                    aria-label="Close form"
                  >
                    <X className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                {submitted ? (
                  /* Honest Success State via Resend */
                  <div className="py-2 space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Message Sent via Resend</span>
                    </div>

                    <h3 className="text-xl font-medium text-[#f6f8fd]">
                      Thank you, {formData.name}!
                    </h3>

                    <p className="text-sm text-[#a9bad1] leading-relaxed">
                      Your message has been delivered directly to{" "}
                      <strong className="font-mono text-[#f6f8fd] font-medium">
                        {recipientEmail}
                      </strong>
                      . I&apos;ll get back to you as soon as possible.
                    </p>

                    <div className="p-4 rounded-xl bg-black/30 border border-white/[0.08] font-mono text-xs text-[#c5d3e6] space-y-1.5">
                      <div>
                        <strong className="text-[#8fa4bf]">To:</strong> {recipientEmail}
                      </div>
                      <div>
                        <strong className="text-[#8fa4bf]">From:</strong> {formData.name} ({formData.email})
                      </div>
                      <div className="pt-2 text-[#9bb0cb] whitespace-pre-wrap font-sans text-sm">
                        {formData.message}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="h-11 px-4 rounded-full border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.08] text-[#f6f8fd] text-xs font-mono inline-flex items-center gap-1.5 transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#8fa4bf]" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs font-mono text-[#8fa4bf] hover:text-white underline underline-offset-4 ml-auto cursor-pointer"
                      >
                        Send another note
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Minimal Refined Contact Form */
                  <form onSubmit={handleSubmit} noValidate className="space-y-7">
                    {/* Name field */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-mono uppercase tracking-wider text-[#8fa4bf] mb-2"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                          if (submitError) setSubmitError(null);
                        }}
                        placeholder="Your name"
                        className="w-full bg-transparent border-b border-white/[0.12] focus:border-white/[0.45] text-base text-[#f6f8fd] py-2.5 focus:outline-none transition-colors placeholder:text-[#475569] font-normal"
                      />
                      {errors.name && (
                        <p className="mt-2 text-xs text-rose-400 font-mono">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-mono uppercase tracking-wider text-[#8fa4bf] mb-2"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                          if (submitError) setSubmitError(null);
                        }}
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-white/[0.12] focus:border-white/[0.45] text-base text-[#f6f8fd] py-2.5 focus:outline-none transition-colors placeholder:text-[#475569] font-normal"
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-rose-400 font-mono">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Message field (Spacious) */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-mono uppercase tracking-wider text-[#8fa4bf] mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: "" });
                          if (submitError) setSubmitError(null);
                        }}
                        placeholder="Tell me about your project, idea, or questions..."
                        className="w-full bg-transparent border-b border-white/[0.12] focus:border-white/[0.45] text-base text-[#f6f8fd] py-2.5 focus:outline-none transition-colors placeholder:text-[#475569] resize-none leading-relaxed font-normal"
                      />
                      {errors.message && (
                        <p className="mt-2 text-xs text-rose-400 font-mono">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Server-Side Error Alert */}
                    {submitError && (
                      <div className="p-3.5 rounded-xl bg-rose-500/[0.12] border border-rose-500/25 text-rose-300 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-200">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex-1 leading-relaxed">{submitError}</div>
                      </div>
                    )}

                    {/* Submit Action: Prominent but Minimal */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 rounded-full bg-[#f6f8fd] hover:bg-white text-[#080e18] font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(246,248,253,0.18)] inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#080e18]" />
                            <span>Sending...</span>
                          </>
                        ) : submitError ? (
                          <>
                            <span>Retry send</span>
                            <ArrowUpRight className="w-4 h-4 text-[#080e18]" />
                          </>
                        ) : (
                          <>
                            <span>Send message</span>
                            <ArrowUpRight className="w-4 h-4 text-[#080e18]" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
