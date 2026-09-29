"use client";

import { useState, useCallback, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

interface CopyButtonProps {
  text?: string;
  label?: string;
  copiedLabel?: string;
  variant?: "primary" | "outline" | "compact" | "badge";
  className?: string;
  children?: ReactNode;
}

export function CopyButton({
  text = siteConfig.email,
  label = "Copy Email",
  copiedLabel = "Copied!",
  variant = "outline",
  className = "",
  children,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, [text]);

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : label}
        title={copied ? copiedLabel : `Copy "${text}"`}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
          copied ? "text-accent" : "text-muted hover:text-foreground"
        } ${className}`}
      >
        {copied ? (
          <>
            <svg
              className="h-3.5 w-3.5 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>{children ?? label}</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "badge") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? copiedLabel : label}
        className={`inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1 text-xs font-mono font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent ${
          copied ? "border-accent text-accent bg-surface-2" : ""
        } ${className}`}
      >
        {copied ? (
          <>
            <svg
              className="h-3 w-3 text-accent shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <svg
              className="h-3 w-3 shrink-0 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>{children ?? text}</span>
          </>
        )}
      </button>
    );
  }

  const baseStyle =
    variant === "primary" ? "btn btn-primary" : "btn btn-outline";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : label}
      className={`${baseStyle} ${
        copied ? "!bg-accent !border-accent !text-on-accent" : ""
      } ${className}`}
    >
      {copied ? (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span>{children ?? label}</span>
        </>
      )}
    </button>
  );
}
