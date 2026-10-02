"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { projects } from "@/config/projects";
import { cyclePalette } from "@/lib/theme";

export function TerminalModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Array<{ cmd: string; output: string[] }>>([
    {
      cmd: "welcome",
      output: [
        "Kauxync Interactive Terminal v1.0.0 (x86_64-pc-none)",
        "Type 'help' for a list of available commands.",
      ],
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+` or Ctrl+~
      if (e.ctrlKey && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const handleOpen = () => setOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("kauxync-open-terminal", handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("kauxync-open-terminal", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [open, history]);

  const executeCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    let out: string[] = [];

    switch (cmd) {
      case "help":
        out = [
          "Available commands:",
          "  whoami      - Developer profile & bio",
          "  stack       - Core tech stack & tools",
          "  projects    - List active projects",
          "  contact     - Display direct contact details",
          "  leetcode    - LeetCode profile & problem solving stats",
          "  theme       - Cycle color theme palette",
          "  sudo hire-me- Secret unlock",
          "  clear       - Clear screen",
          "  exit        - Close terminal window",
        ];
        break;

      case "whoami":
      case "bio":
        out = [
          `Name: ${siteConfig.realName} (Kauxync)`,
          `Role: Full-Stack Developer & Software Builder`,
          `Location: India (IST · UTC+5:30) · Open to Remote`,
          `Status: Open for freelance projects & engineering roles`,
        ];
        break;

      case "stack":
        out = [
          "Frontend : Next.js 16, React 19, TypeScript, Tailwind CSS",
          "Backend  : Node.js, Express, PHP, Laravel, REST & GraphQL",
          "Database : PostgreSQL, MySQL, MongoDB, Supabase, Prisma",
          "Systems  : C, Linux, Git, Docker, Cloud (AWS, Vercel)",
        ];
        break;

      case "projects":
        out = [
          "Featured Projects:",
          ...projects.map((p) => `  * ${p.title} (${p.status || "Live"}) - ${p.summary.slice(0, 70)}...`),
        ];
        break;

      case "contact":
      case "email":
        out = [
          `Direct Email : ${siteConfig.email}`,
          "GitHub       : https://github.com/kauxync",
          "LeetCode     : https://leetcode.com/u/kauxync/",
          "LinkedIn     : https://linkedin.com/in/kauxync",
          "AWS Builder  : https://builder.aws.com/community/@kauxync",
        ];
        break;

      case "leetcode":
      case "dsa":
        out = [
          "LeetCode Profile : @kauxync",
          "Profile URL      : https://leetcode.com/u/kauxync/",
          "Status           : Active Problem Solver",
          "Latest Solved    : Two Sum (C)",
        ];
        break;

      case "theme": {
        const next = cyclePalette();
        out = [`Color theme cycled to: ${next.toUpperCase()}`];
        break;
      }

      case "sudo hire-me":
      case "hire":
        out = [
          "Permission granted. Root privileges activated.",
          `Opening contact channel... Write to: ${siteConfig.email}`,
        ];
        setTimeout(() => {
          router.push("/#connect");
          setOpen(false);
        }, 1200);
        break;

      case "clear":
        setHistory([]);
        return;

      case "exit":
      case "quit":
        setOpen(false);
        return;

      case "":
        out = [];
        break;

      default:
        out = [`Command not found: '${raw}'. Type 'help' for available commands.`];
    }

    setHistory((prev) => [...prev, { cmd: raw, output: out }]);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Floating Terminal Launcher Pill */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Interactive Terminal"
        title="Open Terminal (Ctrl+`)"
        className="fixed bottom-5 right-5 z-40 hidden sm:inline-flex items-center gap-2 border-2 border-foreground bg-[#18181b] text-[#fef08a] px-3.5 py-2 text-xs font-mono font-bold shadow-[4px_4px_0px_#fbbf24] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#fbbf24]"
      >
        <span className="text-[#4ade80]">❯</span>
        <span>terminal</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Developer Terminal"
          className="fixed inset-0 z-[80] p-4 flex items-center justify-center"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-2xl border-2 border-foreground bg-[#0a0a0c] text-[#f4f4f5] shadow-[8px_8px_0px_#fbbf24] overflow-hidden flex flex-col max-h-[85vh]">
            {/* Terminal Window Titlebar */}
            <div className="flex items-center justify-between border-b-2 border-foreground bg-[#18181b] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 border border-foreground bg-[#ef4444]" />
                <span className="h-3 w-3 border border-foreground bg-[#f59e0b]" />
                <span className="h-3 w-3 border border-foreground bg-[#22c55e]" />
                <span className="ml-2 font-mono text-xs font-bold text-muted">
                  kauxync@terminal: ~ (bash)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-mono font-bold uppercase text-muted hover:text-white"
              >
                [Esc] Close
              </button>
            </div>

            {/* Terminal Output Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-xs leading-relaxed space-y-3 max-h-[50vh]"
            >
              {history.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    <span className="text-[#22c55e]">kauxync@dev:~$</span>
                    <span className="font-bold text-white">{item.cmd}</span>
                  </div>
                  {item.output.map((line, j) => (
                    <div key={j} className="text-[#d4d4d8] pl-4">
                      {line}
                    </div>
                  ))}
                </div>
              ))}

              {/* Active Prompt Input */}
              <div className="flex items-center gap-2 pt-1 text-white">
                <span className="text-[#22c55e]">kauxync@dev:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none font-mono text-xs text-[#fef08a] caret-[#fbbf24]"
                  autoFocus
                />
              </div>
            </div>

            <div className="border-t border-zinc-800 bg-[#121215] px-4 py-2 flex items-center justify-between text-[0.6875rem] font-mono text-zinc-500">
              <span>Type &apos;help&apos; for commands</span>
              <span>kauxync.in // dev-mode</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
