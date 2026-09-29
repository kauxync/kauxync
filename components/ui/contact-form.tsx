"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { CopyButton } from "@/components/ui/copy-button";
import { IconMail } from "@/components/ui/icons";

export function ContactForm() {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [topic, setTopic] = useState("Project Collaboration");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: senderEmail.trim(),
          topic,
          message: message.trim(),
          _honeypot: honeypot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          data.error || "Failed to deliver message. Please reach out via email directly."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again or email directly.");
    }
  };

  const handleReset = () => {
    setName("");
    setSenderEmail("");
    setMessage("");
    setTopic("Project Collaboration");
    setStatus("idle");
    setErrorMessage("");
  };

  const fallbackMailto = () => {
    const subject = encodeURIComponent(`[${topic}] Inquiry from ${name || "Website Visitor"}`);
    const body = encodeURIComponent(
      `Hi Kaushalendra,\n\n${message}\n\nFrom: ${name} (${senderEmail})\nSent via kauxync.in`
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="card mt-8 border border-foreground bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="chip text-accent border-accent">Direct Channel</span>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Send a Quick Message
          </h3>
          <p className="mt-1 text-sm text-muted">
            Have a project, role, or idea? Reach out directly — I typically respond within 24 hours.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton
            variant="outline"
            text={siteConfig.email}
            label="Copy Email"
            copiedLabel="Copied!"
          />
        </div>
      </div>

      {status === "success" ? (
        <div className="py-8 text-center space-y-4">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-none border border-accent bg-surface-2 text-accent">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 className="font-display text-2xl font-bold text-foreground">
            Message Delivered!
          </h4>
          <p className="mx-auto max-w-[50ch] text-sm text-muted leading-relaxed">
            Thank you, <strong className="text-foreground">{name}</strong>. Your inquiry has been sent to{" "}
            <strong className="text-foreground">{siteConfig.email}</strong>. I will get back to you at{" "}
            <strong className="text-foreground">{senderEmail}</strong> shortly.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline text-xs"
            >
              ← Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Honeypot field for bot filtering */}
          <input
            type="text"
            name="_gotcha"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {status === "error" ? (
            <div className="border border-line bg-surface-2 p-4 text-xs font-mono space-y-2">
              <p className="font-bold text-foreground">Notice: {errorMessage}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={fallbackMailto}
                  className="font-bold underline text-accent hover:text-foreground"
                >
                  Click here to open in your Email App →
                </button>
                <CopyButton variant="compact" text={siteConfig.email} />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-mono font-bold uppercase tracking-widest text-muted"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={status === "submitting"}
                className="mt-2 h-11 w-full border border-foreground bg-transparent px-3.5 text-sm font-medium outline-none placeholder:text-muted/60 focus:border-accent disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-mono font-bold uppercase tracking-widest text-muted"
              >
                Your Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={status === "submitting"}
                className="mt-2 h-11 w-full border border-foreground bg-transparent px-3.5 text-sm font-medium outline-none placeholder:text-muted/60 focus:border-accent disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-topic"
              className="block text-xs font-mono font-bold uppercase tracking-widest text-muted"
            >
              Topic / Purpose
            </label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={status === "submitting"}
              className="mt-2 h-11 w-full border border-foreground bg-surface px-3.5 text-sm font-medium outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="Project Collaboration">Project Collaboration / Freelance</option>
              <option value="Engineering Opportunity">Full-time Engineering Role</option>
              <option value="Open Source">Open-Source Discussion</option>
              <option value="Quick Coffee Chat">Virtual Coffee / Mentorship</option>
              <option value="General Inquiry">General Question / Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-xs font-mono font-bold uppercase tracking-widest text-muted"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell me a bit about what you're working on or what you'd like to discuss..."
              disabled={status === "submitting"}
              className="mt-2 w-full border border-foreground bg-transparent p-3.5 text-sm font-medium outline-none placeholder:text-muted/60 focus:border-accent disabled:opacity-50"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="text-xs text-muted font-mono">
              Receiver: <strong className="text-foreground">{siteConfig.email}</strong>
            </span>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn btn-primary"
            >
              <IconMail className="h-4 w-4" />
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
