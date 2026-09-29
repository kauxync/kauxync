"use client";

import { useState, useRef, type ReactNode } from "react";

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative my-6 border border-foreground bg-surface-2 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2 text-xs font-mono text-muted">
        <span className="font-bold uppercase tracking-widest text-[0.6875rem]">
          Snippet
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[0.6875rem] text-muted transition-colors duration-200 hover:text-foreground"
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
              <span className="text-accent">Copied!</span>
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
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className={`!border-none !bg-transparent !m-0 overflow-x-auto p-4 font-mono text-sm leading-relaxed ${className}`}
      >
        {children}
      </pre>
    </div>
  );
}
