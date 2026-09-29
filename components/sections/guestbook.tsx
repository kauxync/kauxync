"use client";

import { useState } from "react";
import { guestbookContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { IconGithub } from "@/components/ui/icons";

interface GuestbookEntry {
  name: string;
  handle?: string;
  message: string;
  date: string;
  theme: {
    bg: string;
    shadow: string;
    tag: string;
  };
}

const INITIAL_ENTRIES: GuestbookEntry[] = [
  {
    name: "Aman Verma",
    handle: "@aman_dev",
    message: "Love the neo-brutalist aesthetic and the deep dive into C operators! Inspiring work.",
    date: "Sep 28, 2026",
    theme: {
      bg: "bg-[#f5eeff] dark:bg-[#1a0f2e]",
      shadow: "shadow-[4px_4px_0px_#a855f7]",
      tag: "bg-[#ede4fc] text-[#581c87] dark:bg-[#2e1065] dark:text-[#d8b4fe]",
    },
  },
  {
    name: "Rohan Sharma",
    handle: "@rohansh",
    message: "Project Bihar initiative is fantastic. Great to see regional community builders taking initiative.",
    date: "Sep 27, 2026",
    theme: {
      bg: "bg-[#ecfeff] dark:bg-[#08222c]",
      shadow: "shadow-[4px_4px_0px_#06b6d4]",
      tag: "bg-[#cffafe] text-[#0e7490] dark:bg-[#164e63] dark:text-[#67e8f9]",
    },
  },
  {
    name: "Elena Rostova",
    handle: "@elena_builds",
    message: "The typography and speed on this portfolio is phenomenal. Keep shipping!",
    date: "Sep 26, 2026",
    theme: {
      bg: "bg-[#fffbeb] dark:bg-[#291b05]",
      shadow: "shadow-[4px_4px_0px_#f59e0b]",
      tag: "bg-[#fef3c7] text-[#b45309] dark:bg-[#451a03] dark:text-[#fcd34d]",
    },
  },
];

const ENTRY_THEMES = [
  {
    bg: "bg-[#f0fdf4] dark:bg-[#091b11]",
    shadow: "shadow-[4px_4px_0px_#22c55e]",
    tag: "bg-[#dcfce7] text-[#166534] dark:bg-[#14532d] dark:text-[#dcfce7]",
  },
  {
    bg: "bg-[#f8f9ff] dark:bg-[#10122e]",
    shadow: "shadow-[4px_4px_0px_#6366f1]",
    tag: "bg-[#e0e7ff] text-[#3730a3] dark:bg-[#1e1b4b] dark:text-[#e0e7ff]",
  },
  {
    bg: "bg-[#fffaf5] dark:bg-[#201206]",
    shadow: "shadow-[4px_4px_0px_#f97316]",
    tag: "bg-[#ffedd5] text-[#9a3412] dark:bg-[#431407] dark:text-[#ffedd5]",
  },
];

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_ENTRIES);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [message, setMessage] = useState("");
  const [isSigned, setIsSigned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const theme = ENTRY_THEMES[entries.length % ENTRY_THEMES.length];
    const newEntry: GuestbookEntry = {
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith("@") ? handle.trim() : `@${handle.trim()}`) : undefined,
      message: message.trim(),
      date: "Just now",
      theme,
    };

    setEntries([newEntry, ...entries]);
    setIsSigned(true);
    setName("");
    setHandle("");
    setMessage("");
  };

  return (
    <Section
      id="guestbook"
      index={guestbookContent.index}
      heading={guestbookContent.heading}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        {/* Guestbook Wall */}
        <div className="space-y-4">
          <p className="eyebrow">Recent Signatures</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {entries.map((entry, idx) => (
              <div
                key={`${entry.name}-${idx}`}
                className={`card-hover border-2 border-foreground p-5 ${entry.theme.bg} ${entry.theme.shadow} flex flex-col justify-between`}
              >
                <p className="text-sm font-medium text-foreground/90 leading-relaxed italic">
                  &ldquo;{entry.message}&rdquo;
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-line/80 pt-3">
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">
                      {entry.name}
                    </p>
                    {entry.handle ? (
                      <p className="font-mono text-[0.6875rem] text-muted">
                        {entry.handle}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`border px-2 py-0.5 text-[0.625rem] font-mono font-bold uppercase tracking-wider ${entry.theme.tag}`}
                  >
                    {entry.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign the Guestbook Card */}
        <aside className="card border-2 border-foreground bg-surface p-6 shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.2)]">
          <div className="border-b border-line pb-4">
            <span className="border-2 border-foreground bg-[#fbbf24] px-2.5 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-[#18181b]">
              Interactive Wall
            </span>
            <h3 className="mt-3 font-display text-xl font-bold tracking-tight">
              Sign the Guestbook
            </h3>
            <p className="mt-1 text-xs text-muted">
              Leave your mark, signature, or a greeting on my digital identity space.
            </p>
          </div>

          {isSigned ? (
            <div className="py-6 text-center space-y-3">
              <span className="text-2xl">🎉</span>
              <h4 className="font-display text-base font-bold text-foreground">
                You&apos;re on the wall!
              </h4>
              <p className="text-xs text-muted">
                Thanks for visiting and signing the Kauxync guestbook.
              </p>
              <button
                type="button"
                onClick={() => setIsSigned(false)}
                className="text-xs font-mono font-bold underline text-accent"
              >
                Sign again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="gb-name"
                  className="block text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-muted"
                >
                  Your Name
                </label>
                <input
                  id="gb-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="mt-1.5 h-10 w-full border border-foreground bg-transparent px-3 text-xs font-medium outline-none focus:border-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="gb-handle"
                  className="block text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-muted"
                >
                  GitHub / Twitter (Optional)
                </label>
                <input
                  id="gb-handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@handle"
                  className="mt-1.5 h-10 w-full border border-foreground bg-transparent px-3 text-xs font-medium outline-none focus:border-accent"
                />
              </div>

              <div>
                <label
                  htmlFor="gb-message"
                  className="block text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-muted"
                >
                  Your Message
                </label>
                <textarea
                  id="gb-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey Kaushalendra, great work on..."
                  className="mt-1.5 w-full border border-foreground bg-transparent p-3 text-xs font-medium outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary !h-10 text-xs !bg-[#fbbf24] hover:!bg-[#f59e0b] !text-[#18181b] !border-2 !border-foreground !shadow-[3px_3px_0px_#18181b]"
              >
                ✍️ Sign Wall
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-line pt-4 text-center">
            <a
              href="https://github.com/kauxync/kauxync/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted hover:text-foreground underline"
            >
              <IconGithub className="h-3.5 w-3.5" />
              Discuss on GitHub Discussions →
            </a>
          </div>
        </aside>
      </div>
    </Section>
  );
}
