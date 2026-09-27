import { getSocial } from "@/config/social";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const LEVEL_STYLES = [
  "bg-surface-2",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

function toWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
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
  return weeks;
}

async function fetchContributions(
  username: string,
): Promise<ContributionDay[]> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    {
      headers: { "User-Agent": siteConfig.url.replace(/^https?:\/\//, "") },
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) return [];
  const data = (await response.json()) as {
    contributions?: ContributionDay[];
  };
  return Array.isArray(data.contributions) ? data.contributions : [];
}

export async function GithubContributions() {
  const github = getSocial("github");
  const username = new URL(github.url).pathname.replace(/\//g, "");

  let days: ContributionDay[] = [];
  try {
    days = await fetchContributions(username);
  } catch {
    days = [];
  }
  if (days.length === 0) return null;

  const total = days.reduce((sum, day) => sum + day.count, 0);
  const weeks = toWeeks(days);

  return (
    <section aria-label="Contribution graph" className="border-t border-line">
      <div className="container-site section-pad">
        <Reveal>
          <p className="eyebrow">Open Source</p>
          <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
            <p className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
              {total.toLocaleString("en-US")}
            </p>
            <p className="pb-1 text-sm font-semibold uppercase tracking-wide text-muted sm:pb-2">
              Contributions · Last 12 months
            </p>
          </div>
          <div className="mt-8 overflow-x-auto border border-foreground bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
            <div
              className="grid auto-cols-[11px] grid-flow-col grid-rows-7 gap-[3px]"
              role="img"
              aria-label={`${total} GitHub contributions in the last 12 months`}
            >
              {weeks.map((week, wi) =>
                week.map((day, di) =>
                  day === null ? (
                    <span key={`${wi}-${di}`} className="h-[11px] w-[11px]" />
                  ) : (
                    <span
                      key={day.date}
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                      className={`h-[11px] w-[11px] ${LEVEL_STYLES[Math.min(Math.max(day.level, 0), 4)]}`}
                    />
                  ),
                ),
              )}
            </div>
            <div className="mt-4 flex items-center justify-end gap-1.5 text-[0.6875rem] font-bold uppercase tracking-widest text-muted">
              <span>Less</span>
              {LEVEL_STYLES.map((style) => (
                <span key={style} aria-hidden className={`h-[11px] w-[11px] ${style}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
