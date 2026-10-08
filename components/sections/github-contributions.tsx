"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocial } from "@/config/social";
import { IconArrowUpRight, IconGithub } from "@/components/ui/icons";
import { AnimateIn, AnimateStagger, AnimateItem, AnimateCounter } from "@/components/ui/animate-ui";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ActivityItem {
  id: string;
  text: string;
  detail: string;
  createdAt: string;
  url: string;
  badge: string;
}

interface GithubData {
  days: ContributionDay[];
  total: number;
  publicRepos: number;
  events: ActivityItem[];
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
  "bg-neutral-200 dark:bg-[#161b22]",
  "bg-[#0e4429] border border-[#006d32]/30",
  "bg-[#006d32] border border-[#26a641]/40",
  "bg-[#26a641] border border-[#39d353]/50",
  "bg-[#39d353] border border-emerald-400",
];

function generateDefaultDays(): ContributionDay[] {
  const days: ContributionDay[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      count: 0,
      level: 0,
    });
  }
  return days;
}

const INITIAL_FALLBACK: GithubData = {
  days: generateDefaultDays(),
  total: 82,
  publicRepos: 14,
  events: [
    {
      id: "ev-1",
      badge: "Push",
      text: "Pushed to kauxync (main)",
      detail: "main · commit c2e4b34",
      createdAt: "2026-10-07T18:30:00.000Z",
      url: "https://github.com/kauxync/kauxync",
    },
    {
      id: "ev-2",
      badge: "Push",
      text: "Pushed to OmniArticle (main)",
      detail: "main · commit 2f8a45a",
      createdAt: "2026-10-06T12:00:00.000Z",
      url: "https://github.com/kauxync/OmniArticle",
    },
  ],
};

function timeAgo(iso: string): string {
  const seconds = Math.max(
    1,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
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

function processCalendar(days: ContributionDay[]): {
  weeks: (ContributionDay | null)[][];
  monthLabels: Record<number, string>;
  activeDays: number;
  maxStreak: number;
} {
  let activeDays = 0;
  let currentRun = 0;
  let maxStreak = 0;

  days.forEach((day) => {
    if (day.count > 0) {
      activeDays += 1;
      currentRun += 1;
      if (currentRun > maxStreak) maxStreak = currentRun;
    } else {
      currentRun = 0;
    }
  });

  // Pad to start on Sunday
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

  // Calculate month labels aligned with week columns
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
    weeks,
    monthLabels,
    activeDays,
    maxStreak,
  };
}

export function GithubContributions() {
  const [data, setData] = useState<GithubData>(INITIAL_FALLBACK);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const github = getSocial("github");
  const username =
    new URL(github.url).pathname.replace(/\//g, "") || "kauxync";

  const syncData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/github", {
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
      console.warn("Could not sync live GitHub data:", err);
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

  const { days, total, publicRepos, events } = data;
  const { weeks, monthLabels, activeDays, maxStreak } = processCalendar(days);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const targetYearContributions = 200;
  const progressPercent = Math.min(
    100,
    Math.max(4, (total / targetYearContributions) * 100),
  );
  const strokeDashoffset =
    circumference - (circumference * progressPercent) / 100;

  return (
    <section aria-label="Contribution graph" className="border-t border-line">
      <div className="container-site section-pad">
        {/* Section Header */}
        <AnimateIn variant="up" className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <IconGithub className="h-4 w-4 text-foreground" />
              <p className="eyebrow">Open Source</p>
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
              GitHub Activity
            </h2>
          </div>
          <a
            href={github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors duration-200 hover:text-accent link-underline"
          >
            <span>github.com/{username}</span>
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </AnimateIn>

        {/* Main Dashboard Cards */}
        <AnimateStagger stagger={0.12} delay={0.08} className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr]">
          {/* Card 1: Overview & Metrics */}
          <AnimateItem
            variant="scale"
            className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Overview
                </h3>
                <span className="font-mono text-xs font-semibold text-muted">
                  @{username}
                </span>
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
                      stroke="#39d353"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                      <AnimateCounter value={total} duration={1} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Year
                    </span>
                  </div>
                </div>

                {/* Highlights Breakdown */}
                <div className="flex-1 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground">
                        Public Repos
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={publicRepos} duration={0.8} />
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#39d353] transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (publicRepos / 20) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted">
                        Active Days
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={activeDays} duration={0.8} />d
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#26a641] transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (activeDays / 100) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-muted">
                        Max Streak
                      </span>
                      <span className="font-mono text-xs font-semibold text-foreground">
                        <AnimateCounter value={maxStreak} duration={0.8} />d
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#006d32] transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (maxStreak / 30) * 100)}%`,
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
                <p className="text-[10px] uppercase text-muted">Total Repos</p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {publicRepos} repos
                </p>
              </div>
              <div className="rounded bg-surface-2 p-2 text-center">
                <p className="text-[10px] uppercase text-muted">Streak</p>
                <p className="mt-0.5 text-sm font-bold text-foreground">
                  {maxStreak} days
                </p>
              </div>
            </div>
          </AnimateItem>

          {/* Card 2: Contributions Calendar */}
          <AnimateItem
            variant="scale"
            className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div>
              <div className="mb-4 flex flex-col gap-2 border-b border-line/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-bold text-foreground sm:text-xl">
                    <AnimateCounter value={total} duration={1} />
                  </span>
                  <span className="text-sm font-medium text-muted">
                    contributions in the last year
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
                      aria-label={`${total} GitHub contributions in the last year`}
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
                              title={`${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${formatTooltipDate(day.date)}`}
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
                @{username} · github.com
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

        {/* Card 3: Recent GitHub Activity List */}
        {events.length > 0 && (
          <AnimateIn variant="up" delay={0.15} className="mt-6 rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Recent Activity
                </h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
              </div>
              <a
                href={`https://github.com/${username}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted transition-colors duration-200 hover:text-accent link-underline"
              >
                View Repositories
                <IconArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <AnimateStagger stagger={0.06} delay={0.05} as="ul" className="divide-y divide-line/60">
              {events.map((item) => (
                <AnimateItem
                  key={item.id}
                  as="li"
                  variant="up"
                  className="flex flex-wrap items-center justify-between gap-3 py-3.5 text-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#39d353]/20 text-xs font-bold text-[#39d353]">
                      ✓
                    </span>
                    <div className="min-w-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate font-medium text-foreground transition-colors hover:text-accent"
                      >
                        {item.text}
                      </a>
                      {item.detail && (
                        <p className="truncate text-xs text-muted">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs">
                    <span className="rounded bg-surface-2 px-2 py-0.5 text-muted">
                      {item.badge}
                    </span>
                    <span suppressHydrationWarning className="text-muted">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </AnimateItem>
              ))}
            </AnimateStagger>
          </AnimateIn>
        )}
      </div>
    </section>
  );
}
