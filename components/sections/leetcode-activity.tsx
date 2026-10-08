"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocial } from "@/config/social";
import { IconArrowUpRight, IconLeetcode } from "@/components/ui/icons";
import { AnimateIn, AnimateStagger, AnimateItem, AnimateCounter } from "@/components/ui/animate-ui";

interface LeetcodeSubmission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

interface LeetcodeStats {
  all: number;
  easy: number;
  medium: number;
  hard: number;
  ranking?: number;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface LeetcodeData {
  submissions: LeetcodeSubmission[];
  stats: LeetcodeStats;
  calendar: Record<string, number>;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LEVEL_STYLES = [
  "bg-neutral-200 dark:bg-[#282828]",
  "bg-[#1e4734] border border-[#2d794b]/30",
  "bg-[#2d794b] border border-[#3ca863]/40",
  "bg-[#3ca863] border border-[#2cbb5d]/50",
  "bg-[#2cbb5d] border border-emerald-400",
];

const INITIAL_FALLBACK: LeetcodeData = {
  submissions: [
    {
      title: "Second Highest Salary",
      titleSlug: "second-highest-salary",
      timestamp: "1790917104",
      statusDisplay: "Accepted",
      lang: "mysql",
    },
    {
      title: "Combine Two Tables",
      titleSlug: "combine-two-tables",
      timestamp: "1790916837",
      statusDisplay: "Accepted",
      lang: "mysql",
    },
    {
      title: "Two Sum",
      titleSlug: "two-sum",
      timestamp: "1790909245",
      statusDisplay: "Accepted",
      lang: "c",
    },
  ],
  stats: {
    all: 3,
    easy: 2,
    medium: 1,
    hard: 0,
    ranking: 5000001,
  },
  calendar: {
    "1790899200": 3,
  },
};

function timeAgo(seconds: string | number): string {
  const ts = Number(seconds) * 1000;
  const diff = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return "just now";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatLanguage(lang: string): string {
  const map: Record<string, string> = {
    c: "C",
    cpp: "C++",
    python: "Python",
    python3: "Python 3",
    javascript: "JavaScript",
    typescript: "TypeScript",
    java: "Java",
    rust: "Rust",
    golang: "Go",
    csharp: "C#",
    sql: "SQL",
    mysql: "MySQL",
  };
  return map[lang.toLowerCase()] ?? lang.toUpperCase();
}

function formatTooltipDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function generateYearDays(calendarMap: Record<string, number>): {
  days: ContributionDay[];
  weeks: (ContributionDay | null)[][];
  monthLabels: Record<number, string>;
  totalSubmissions: number;
  activeDays: number;
  maxStreak: number;
} {
  const countByDate = new Map<string, number>();
  let totalSubmissions = 0;

  for (const [ts, count] of Object.entries(calendarMap)) {
    const num = Number(count) || 0;
    const dateStr = new Date(Number(ts) * 1000).toISOString().split("T")[0];
    countByDate.set(dateStr, (countByDate.get(dateStr) ?? 0) + num);
    totalSubmissions += num;
  }

  const days: ContributionDay[] = [];
  let activeDays = 0;
  let currentRun = 0;
  let maxStreak = 0;

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = countByDate.get(dateStr) ?? 0;

    let level = 0;
    if (count >= 10) level = 4;
    else if (count >= 6) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    if (count > 0) {
      activeDays += 1;
      currentRun += 1;
      if (currentRun > maxStreak) maxStreak = currentRun;
    } else {
      currentRun = 0;
    }

    days.push({
      date: dateStr,
      count,
      level,
    });
  }

  const padded: (ContributionDay | null)[] = [...days];
  if (padded.length > 0 && padded[0]) {
    const first = new Date(`${padded[0].date}T00:00:00Z`).getUTCDay();
    for (let i = 0; i < first; i++) padded.unshift(null);
  }
  while (padded.length % 7 !== 0) padded.push(null);

  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  const monthLabels: Record<number, string> = {};
  let lastMonth = -1;
  let lastLabelIndex = -99;

  weeks.forEach((week, wi) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;
    const d = new Date(`${firstDay.date}T00:00:00Z`);
    const month = d.getUTCMonth();
    if (month !== lastMonth && wi - lastLabelIndex >= 3) {
      monthLabels[wi] = MONTH_NAMES[month];
      lastMonth = month;
      lastLabelIndex = wi;
    }
  });

  return {
    days,
    weeks,
    monthLabels,
    totalSubmissions,
    activeDays,
    maxStreak,
  };
}

export function LeetcodeActivity() {
  const [data, setData] = useState<LeetcodeData>(INITIAL_FALLBACK);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  let leetcodeUrl = "https://leetcode.com/u/kauxync/";
  let username = "kauxync";
  try {
    const leetcodeSocial = getSocial("leetcode");
    leetcodeUrl = leetcodeSocial.url;
    const match = new URL(leetcodeUrl).pathname.split("/").filter(Boolean);
    username =
      match[match.length - 1] === "u"
        ? match[0]
        : match[match.length - 1] || "kauxync";
    if (username.startsWith("u")) username = match[1] || "kauxync";
  } catch {
    // default to kauxync
  }

  const syncData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/leetcode", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setLastSynced(new Date());
        }
      }
    } catch (err) {
      console.warn("Could not sync live LeetCode data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncData();
    }, 0);
    const handleFocus = () => syncData();
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(syncData, 45000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [syncData]);

  const { submissions, stats, calendar } = data;
  const {
    weeks,
    monthLabels,
    totalSubmissions,
    activeDays,
    maxStreak,
  } = generateYearDays(calendar);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const totalLibrary = 3500;
  const solvedPercent = Math.min(100, (stats.all / totalLibrary) * 100);
  const strokeDashoffset =
    circumference - (circumference * Math.max(solvedPercent, 2)) / 100;

  return (
    <section aria-label="LeetCode activity" className="border-t border-line">
      <div className="container-site section-pad">
        {/* Section Header */}
        <AnimateIn variant="up" className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <IconLeetcode className="h-4 w-4 text-[#ffa116]" />
              <p className="eyebrow">LeetCode</p>
              <button
                type="button"
                onClick={syncData}
                disabled={isRefreshing}
                title={
                  lastSynced
                    ? `Last synced: ${lastSynced.toLocaleTimeString()} (click to refresh)`
                    : "Click to refresh live stats"
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${isRefreshing ? "animate-spin" : "animate-pulse"}`}
                />
                <span>{isRefreshing ? "Syncing..." : "Live"}</span>
              </button>
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Problem Solving
            </h2>
          </div>
          <a
            href={leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors duration-200 hover:text-accent link-underline"
          >
            <span>leetcode.com/u/{username}</span>
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </AnimateIn>

        {/* Main Dashboard Cards */}
        <AnimateStagger stagger={0.12} delay={0.08} className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
          {/* Card 1: Solved Problems */}
          <AnimateItem
            variant="scale"
            className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Solved Problems
                </h3>
                {stats.ranking && (
                  <span className="font-mono text-xs font-semibold text-muted">
                    #{stats.ranking.toLocaleString("en-US")}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-5">
                {/* Circular Donut Gauge */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg
                    className="h-24 w-24 -rotate-90 transform"
                    viewBox="0 0 96 96"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-neutral-200 dark:text-neutral-800"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      fill="transparent"
                      stroke="#00b8a3"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                      <AnimateCounter value={stats.all} duration={1} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Solved
                    </span>
                  </div>
                </div>

                {/* Difficulty Breakdown Bars */}
                <div className="flex-1 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#00b8a3]">Easy</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={stats.easy} duration={0.8} />
                        <span className="font-normal text-muted"> / 968</span>
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#00b8a3] transition-all duration-700"
                        style={{
                          width: `${Math.max(stats.easy > 0 ? 6 : 0, Math.min(100, (stats.easy / 968) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#ffc01e]">Med.</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={stats.medium} duration={0.8} />
                        <span className="font-normal text-muted"> / 2122</span>
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#ffc01e] transition-all duration-700"
                        style={{
                          width: `${Math.max(stats.medium > 0 ? 6 : 0, Math.min(100, (stats.medium / 2122) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#ef4743]">Hard</span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={stats.hard} duration={0.8} />
                        <span className="font-normal text-muted"> / 979</span>
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#ef4743] transition-all duration-700"
                        style={{
                          width: `${Math.max(stats.hard > 0 ? 6 : 0, Math.min(100, (stats.hard / 979) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Stats */}
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-line/60 pt-4 text-xs font-mono">
              <div className="rounded bg-surface-2 p-2 text-center">
                <p className="text-[10px] uppercase text-muted">Active Days</p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {activeDays}d
                </p>
              </div>
              <div className="rounded bg-surface-2 p-2 text-center">
                <p className="text-[10px] uppercase text-muted">Max Streak</p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {maxStreak}d
                </p>
              </div>
            </div>
          </AnimateItem>

          {/* Card 2: Submissions Heatmap */}
          <AnimateItem
            variant="scale"
            className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div>
              <div className="mb-4 flex flex-col gap-2 border-b border-line/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-foreground sm:text-xl">
                    <AnimateCounter value={totalSubmissions} duration={1} />
                  </span>
                  <span className="text-sm font-medium text-muted">
                    submission{totalSubmissions === 1 ? "" : "s"} in the past one year
                  </span>
                </div>
                <div className="flex items-center gap-5 text-xs text-muted">
                  <div>
                    Total active days:{" "}
                    <span className="font-semibold text-foreground">
                      {activeDays}
                    </span>
                  </div>
                  <div>
                    Max streak:{" "}
                    <span className="font-semibold text-foreground">
                      {maxStreak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[760px]">
                  <div className="mb-1.5 flex items-center">
                    <div className="w-7 shrink-0" />
                    <div className="grid grid-flow-col auto-cols-[11px] gap-[3px] text-[10px] text-muted select-none">
                      {weeks.map((_, wi) => (
                        <span
                          key={wi}
                          className="w-[11px] overflow-visible whitespace-nowrap"
                        >
                          {monthLabels[wi] ?? ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="grid h-[95px] w-7 shrink-0 grid-rows-7 gap-[3px] text-[10px] text-muted select-none">
                      <span />
                      <span className="leading-[11px]">Mon</span>
                      <span />
                      <span className="leading-[11px]">Wed</span>
                      <span />
                      <span className="leading-[11px]">Fri</span>
                      <span />
                    </div>

                    <div
                      className="grid h-[95px] auto-cols-[11px] grid-flow-col grid-rows-7 gap-[3px]"
                      role="img"
                      aria-label={`${totalSubmissions} LeetCode submissions in the past one year`}
                    >
                      {weeks.map((week, wi) =>
                        week.map((day, di) =>
                          day === null ? (
                            <span
                              key={`${wi}-${di}`}
                              className="h-[11px] w-[11px]"
                            />
                          ) : (
                            <span
                              key={day.date}
                              title={`${day.count === 0 ? "No" : day.count} submission${day.count === 1 ? "" : "s"} on ${formatTooltipDate(day.date)}`}
                              className={`h-[11px] w-[11px] rounded-[2px] transition-colors duration-150 hover:ring-1 hover:ring-foreground ${LEVEL_STYLES[Math.min(Math.max(day.level, 0), 4)]}`}
                            />
                          ),
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-xs text-muted">
              <span className="font-mono text-[11px]">
                @{username} · leetcode.com
              </span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>Less</span>
                {LEVEL_STYLES.map((style, idx) => (
                  <span
                    key={idx}
                    aria-hidden
                    className={`h-[11px] w-[11px] rounded-[2px] ${style}`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </AnimateItem>
        </AnimateStagger>

        {/* Card 3: Recent Submissions List */}
        {submissions.length > 0 && (
          <AnimateIn variant="up" delay={0.15} className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Recent Submissions
                </h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
              </div>
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted transition-colors duration-200 hover:text-accent link-underline"
              >
                View Profile
                <IconArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <AnimateStagger stagger={0.06} delay={0.05} as="ul" className="divide-y divide-line/60">
              {submissions.map((item, index) => {
                const isAccepted =
                  item.statusDisplay.toLowerCase() === "accepted";
                return (
                  <AnimateItem
                    key={`${item.titleSlug}-${item.timestamp}-${index}`}
                    as="li"
                    variant="up"
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isAccepted
                            ? "bg-[#2cbb5d]/20 text-[#2cbb5d]"
                            : "bg-rose-500/20 text-rose-500"
                        }`}
                        title={item.statusDisplay}
                      >
                        {isAccepted ? "✓" : "✗"}
                      </span>
                      <a
                        href={`https://leetcode.com/problems/${item.titleSlug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-medium text-foreground transition-colors hover:text-accent"
                      >
                        {item.title}
                      </a>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                      <span className="rounded bg-surface-2 px-2 py-0.5 text-muted">
                        {formatLanguage(item.lang)}
                      </span>
                      <span suppressHydrationWarning className="text-muted">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                  </AnimateItem>
                );
              })}
            </AnimateStagger>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
