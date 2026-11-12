"use client";

import React, { useState, useEffect, useRef } from "react";
import { MousePointer2, PenLine } from "lucide-react";
import MeadowGarden from "./MeadowGarden";

const BRAND_ICONS: Record<string, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  x:
    "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  github:
    "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
};

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/arshin-akil-82843532b/",
    brand: "linkedin",
  },
  {
    name: "X",
    url: "https://x.com/",
    brand: "x",
  },
  {
    name: "GitHub",
    url: "https://github.com/arshin29",
    brand: "github",
  },
];

export default function Contact() {
  const [isHovered, setIsHovered] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<"privacy" | "weather" | null>(null);
  const footerLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (footerLinksRef.current && !footerLinksRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const footerRef = useRef<HTMLElement | null>(null);

  // Listen for the global sky:open-contact event from "Let's talk" button in Hero
  useEffect(() => {
    const handleOpenContact = () => {
      setIsNoteOpen(true);
      setIsHovered(true);
      if (footerRef.current) {
        footerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("sky:open-contact", handleOpenContact);
    return () => window.removeEventListener("sky:open-contact", handleOpenContact);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rotateX = (0.5 - (e.clientY - rect.top) / rect.height) * 7;
    const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 9;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const validateFields = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Required";
    }
    if (!formData.email.trim()) {
      errors.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      errors.email = "Check email";
    }
    if (!formData.message.trim()) {
      errors.message = "Required";
    } else if (formData.message.trim().length < 5) {
      errors.message = "Too short";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message. Please try again.");
      }

      setSubmitSuccess(true);
      setIsNoteOpen(false);
      setFormData({ name: "", email: "", message: "" });
      setFieldErrors({});
    } catch (err: any) {
      setGeneralError(err?.message || "Could not deliver your note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpanded = isHovered || isNoteOpen;

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="meadow-footer w-full relative overflow-hidden flex flex-col justify-between"
    >
      <div
        className="meadow-contact-layout"
        data-contact-open={isNoteOpen && !submitSuccess}
        data-message-sent={submitSuccess}
      >
        {/* Left Column: Heading, Subhead & Morphing Liquid Glass Controls */}
        <div className="meadow-closing" data-message-sent={submitSuccess}>
          <h2 aria-live="polite" tabIndex={-1}>
            <span className="meadow-copy-before" aria-hidden={submitSuccess}>
              Touch some grass <span className="meadow-smile select-none" aria-hidden="true">ツ</span>
            </span>
            <span className="meadow-copy-after" aria-hidden={!submitSuccess}>
              I’ll write back soon!
            </span>
          </h2>
          <p>
            <span className="meadow-copy-before" aria-hidden={submitSuccess}>
              Have a product to build, or a team that needs a developer? I’d love to work together. Tell me a little about it.
            </span>
            <span className="meadow-copy-after" aria-hidden={!submitSuccess}>
              Thanks for your note.<br />I’m looking forward to our conversation.
            </span>
          </p>

          {/* Morphing Liquid Button & 3 Social Pill Buttons */}
          <div
            className="meadow-connect"
            data-open={isExpanded}
            data-ready={isExpanded}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(document.activeElement)) {
                setIsHovered(false);
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsHovered(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsHovered(false);
                if (isNoteOpen) setIsNoteOpen(false);
              }
            }}
          >
            {/* Primary Toggle Button */}
            <button
              type="button"
              className="meadow-contact sky-pill"
              data-label-expanded={isExpanded || submitSuccess}
              aria-label={
                submitSuccess
                  ? "Write another note"
                  : isExpanded
                  ? "Write a note"
                  : "Let’s connect"
              }
              aria-expanded={isNoteOpen}
              aria-controls="sky-contact-panel"
              onFocus={() => setIsHovered(true)}
              onClick={() => {
                if (isNoteOpen) {
                  setIsNoteOpen(false);
                } else {
                  setIsNoteOpen(true);
                  setIsHovered(true);
                }
              }}
            >
              <span className="meadow-contact-label" aria-hidden="true">
                <span className="meadow-label-connect">Let’s connect</span>
                <span className="meadow-label-note">
                  {submitSuccess ? "Write another note" : "Write a note"}
                </span>
              </span>

              <span className="meadow-contact-icons" aria-hidden="true">
                {/* Default icon: MousePointer2 */}
                <span
                  style={{
                    opacity: !(isExpanded || submitSuccess) ? 1 : 0,
                    transform: !(isExpanded || submitSuccess) ? "scale(1)" : "scale(0.25)",
                    filter: !(isExpanded || submitSuccess) ? "blur(0px)" : "blur(4px)",
                    transition: "opacity 0.22s ease, transform 0.22s ease, filter 0.22s ease",
                  }}
                >
                  <MousePointer2 size={18} />
                </span>

                {/* Hovered / Expanded icon: PenLine */}
                <span
                  style={{
                    opacity: isExpanded || submitSuccess ? 1 : 0,
                    transform: isExpanded || submitSuccess ? "scale(1)" : "scale(0.25)",
                    filter: isExpanded || submitSuccess ? "blur(0px)" : "blur(4px)",
                    transition: "opacity 0.22s ease, transform 0.22s ease, filter 0.22s ease",
                  }}
                >
                  <PenLine size={18} />
                </span>
              </span>
            </button>

            {/* 3 Social Buttons Next to Main Button */}
            <nav
              id="meadow-social-links"
              className="meadow-socials"
              aria-label="Social links"
              aria-hidden={!isExpanded}
            >
              {SOCIAL_LINKS.map((link, index) => (
                <a
                  key={link.brand}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.name}
                  title={link.name}
                  data-brand={link.brand}
                  className="sky-pill"
                  style={{
                    transform: isExpanded
                      ? "scale(1) translateX(0)"
                      : `scale(0.02) translateX(${-82 - index * 58}px)`,
                    opacity: isExpanded ? 1 : 0,
                    pointerEvents: isExpanded ? "auto" : "none",
                    transition:
                      "transform 0.42s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease-out, background-color 0.15s ease",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={BRAND_ICONS[link.brand]} fill="currentColor" />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Paper Note Reveal Modal/Panel in Meadow */}
        {isNoteOpen && (
          <div className="meadow-paper-reveal" id="sky-contact-panel">
            <div
              className="sky-paper-contact"
              data-phase={isSubmitting ? "waiting" : "writing"}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(-2deg)`,
              }}
            >
              <form
                className="sky-contact-note"
                onSubmit={handleSubmit}
                noValidate
                aria-busy={isSubmitting}
              >
                <div className="sky-note-content">
                  {/* Close button with subtle cross */}
                  <button
                    type="button"
                    className="sky-note-close"
                    aria-label="Close message form"
                    onClick={() => setIsNoteOpen(false)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 4.5C8 8 14.5 14 19 19.5M19.5 5C15 8 9 14.5 4.5 19"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 4.8L18.2 19M19 6L5.3 18.5"
                        stroke="currentColor"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                    </svg>
                  </button>

                  <h3>Let’s talk.</h3>

                  <fieldset disabled={isSubmitting} className="space-y-1">
                    {/* Honeypot for spam bots */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="opacity-0 pointer-events-none w-px h-px absolute"
                      aria-hidden="true"
                    />

                    {/* Name Field */}
                    <div className="sky-note-field">
                      <div className="sky-note-field-heading">
                        <label htmlFor="sky-note-name">Your name</label>
                        {fieldErrors.name && (
                          <span id="sky-note-name-error" className="sky-note-error">
                            {fieldErrors.name}
                          </span>
                        )}
                      </div>
                      <input
                        id="sky-note-name"
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) {
                            setFieldErrors({ ...fieldErrors, name: undefined });
                          }
                        }}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="sky-note-field">
                      <div className="sky-note-field-heading">
                        <label htmlFor="sky-note-email">Your email</label>
                        {fieldErrors.email && (
                          <span id="sky-note-email-error" className="sky-note-error">
                            {fieldErrors.email}
                          </span>
                        )}
                      </div>
                      <input
                        id="sky-note-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (fieldErrors.email) {
                            setFieldErrors({ ...fieldErrors, email: undefined });
                          }
                        }}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="sky-note-field">
                      <div className="sky-note-field-heading">
                        <label htmlFor="sky-note-message">Your message</label>
                        {fieldErrors.message && (
                          <span id="sky-note-message-error" className="sky-note-error">
                            {fieldErrors.message}
                          </span>
                        )}
                      </div>
                      <textarea
                        id="sky-note-message"
                        name="message"
                        required
                        maxLength={2000}
                        rows={3}
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (fieldErrors.message) {
                            setFieldErrors({ ...fieldErrors, message: undefined });
                          }
                        }}
                      />
                    </div>

                    {generalError && (
                      <p className="text-xs text-rose-700 mt-2 font-sans font-medium">
                        {generalError}
                      </p>
                    )}

                    {/* Torn Masking Tape Send Button */}
                    <button
                      className="sky-note-tape select-none"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send message"}
                    </button>
                  </fieldset>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 3D Swaying Grass Meadow with Hill & Pond */}
      <MeadowGarden />

      {/* Authentic Reference Meadow Credit Bar */}
      <div className="meadow-credit">
        <span>&copy; {new Date().getFullYear()} Arshin Akil</span>

        <div className="meadow-footer-links" ref={footerLinksRef}>
          <details
            className="meadow-analytics"
            open={openPopover === "privacy"}
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setOpenPopover((prev) => (prev === "privacy" ? null : "privacy"));
              }}
            >
              Privacy policy
            </summary>
            <div className="meadow-analytics-card">
              <p>Anonymous visits and time spent help improve this portfolio. No personal tracking.</p>
              <p className="meadow-credit-phone">
                Weather data by{" "}
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
                  Open-Meteo
                </a>{" "}
                (
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
                  CC BY 4.0
                </a>
                ); cloud observations from{" "}
                <a href="https://aviationweather.gov/" target="_blank" rel="noreferrer">
                  AWC
                </a>
                .
              </p>
            </div>
          </details>

          <details
            className="meadow-analytics meadow-weather-source"
            open={openPopover === "weather"}
          >
            <summary
              onClick={(e) => {
                e.preventDefault();
                setOpenPopover((prev) => (prev === "weather" ? null : "weather"));
              }}
            >
              Weather source
            </summary>
            <div className="meadow-analytics-card">
              <p>
                Weather data by{" "}
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
                  Open-Meteo
                </a>
                ; cloud observations from{" "}
                <a href="https://aviationweather.gov/" target="_blank" rel="noreferrer">
                  AWC
                </a>
                . Open-Meteo data is licensed under{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
                  CC BY 4.0
                </a>{" "}
                and interpreted to render the sky.
              </p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
}
