"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { IconX, IconLinkedin } from "@/components/ui/icons";

interface PostShareProps {
  title: string;
  slug: string;
}

export function PostShare({ title, slug }: PostShareProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/blog/${slug}`;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
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

  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    `"${title}" by @kauxync`
  )}&url=${encodeURIComponent(url)}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
        Share
      </span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="inline-flex h-9 items-center gap-1.5 border border-line bg-surface px-3 text-xs font-medium transition-colors duration-200 hover:border-foreground hover:text-foreground"
      >
        <IconX className="h-3.5 w-3.5" />
        <span>Post</span>
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex h-9 items-center gap-1.5 border border-line bg-surface px-3 text-xs font-medium transition-colors duration-200 hover:border-foreground hover:text-foreground"
      >
        <IconLinkedin className="h-3.5 w-3.5" />
        <span>LinkedIn</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy article link"}
        className="inline-flex h-9 items-center gap-1.5 border border-line bg-surface px-3 text-xs font-medium transition-colors duration-200 hover:border-foreground hover:text-foreground"
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
              className="h-3.5 w-3.5 text-muted"
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
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
