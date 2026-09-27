import { getSocial } from "@/config/social";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { IconArrowUpRight } from "@/components/ui/icons";

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: { message: string }[];
    action?: string;
    ref?: string;
    ref_type?: string;
    release?: { tag_name: string };
    pull_request?: { title: string; number: number; merged?: boolean };
  };
}

interface ActivityItem {
  id: string;
  text: string;
  detail: string;
  createdAt: string;
  url: string;
}

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

function toActivity(event: GithubEvent): ActivityItem | null {
  const shortRepo = event.repo.name.split("/")[1] ?? event.repo.name;
  const url = `https://github.com/${event.repo.name}`;
  const base = { id: event.id, createdAt: event.created_at, url };

  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload?.commits ?? [];
      if (commits.length === 0) {
        return { ...base, text: `Pushed to ${shortRepo}`, detail: "" };
      }
      const message = commits[0]?.message.split("\n")[0] ?? "";
      return {
        ...base,
        text: `Pushed ${commits.length === 1 ? "a commit" : `${commits.length} commits`} to ${shortRepo}`,
        detail: message,
      };
    }
    case "CreateEvent": {
      const refType = event.payload?.ref_type ?? "";
      const ref = event.payload?.ref ? ` ${event.payload.ref}` : "";
      return {
        ...base,
        text: `Created ${refType}${ref} in ${shortRepo}`,
        detail: "",
      };
    }
    case "PullRequestEvent": {
      const pr = event.payload?.pull_request;
      const action =
        event.payload?.action === "closed" && pr?.merged === true
          ? "Merged"
          : "Opened";
      return {
        ...base,
        text: `${action} pull request in ${shortRepo}`,
        detail: pr ? `#${pr.number} ${pr.title}` : "",
      };
    }
    case "ReleaseEvent": {
      const tag = event.payload?.release?.tag_name ?? "";
      return { ...base, text: `Released ${tag} in ${shortRepo}`, detail: "" };
    }
    case "ForkEvent":
      return { ...base, text: `Forked ${shortRepo}`, detail: "" };
    default:
      return null;
  }
}

async function fetchActivity(username: string): Promise<ActivityItem[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": siteConfig.url.replace(/^https?:\/\//, ""),
      },
      next: { revalidate: 3600 },
    },
  );
  if (!response.ok) return [];
  const events = (await response.json()) as GithubEvent[];
  return events
    .map(toActivity)
    .filter((item): item is ActivityItem => item !== null)
    .slice(0, 6);
}

export async function GithubActivity() {
  const github = getSocial("github");
  const username = new URL(github.url).pathname.replace(/\//g, "");

  let items: ActivityItem[] = [];
  try {
    items = await fetchActivity(username);
  } catch {
    items = [];
  }
  if (items.length === 0) return null;

  return (
    <section aria-label="Open-source activity" className="border-t border-line">
      <div className="container-site section-pad">
        <Reveal>
          <p className="eyebrow">GitHub</p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Recent activity
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="grid gap-1 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-8 sm:py-5"
              >
                <span className="eyebrow translate-y-[2px]">
                  {timeAgo(item.createdAt)}
                </span>
                <p className="text-[0.975rem] leading-6 sm:text-base">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold tracking-tight transition-colors duration-200 hover:text-accent link-underline"
                  >
                    {item.text}
                  </a>
                  {item.detail ? (
                    <span className="mt-0.5 block truncate text-sm text-muted">
                      {item.detail}
                    </span>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-200 hover:text-accent link-underline"
            >
              More on GitHub
              <IconArrowUpRight className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
