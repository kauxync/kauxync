import { NextResponse } from "next/server";
import { getSocial } from "@/config/social";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload?: {
    commits?: { message: string }[];
    size?: number;
    distinct_size?: number;
    head?: string;
    before?: string;
    action?: string;
    ref?: string;
    ref_type?: string;
    release?: { tag_name: string };
    pull_request?: { title: string; number: number; merged?: boolean; html_url?: string };
  };
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

// In-memory cache to stay well within GitHub's unauthenticated rate limits (60 req/hr)
let cachedGithubData: GithubData | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function parseGithubEvent(event: GithubEvent): ActivityItem | null {
  const repoName = event.repo.name;
  const shortRepo = repoName.split("/")[1] ?? repoName;
  const url = `https://github.com/${repoName}`;
  const base = {
    id: event.id,
    createdAt: event.created_at,
    url,
  };

  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload?.commits ?? [];
      const count =
        event.payload?.size ??
        event.payload?.distinct_size ??
        commits.length;
      const branch = event.payload?.ref
        ? event.payload.ref.replace(/^refs\/heads\//, "")
        : "";
      const head = event.payload?.head ? event.payload.head.slice(0, 7) : "";
      const commitUrl = event.payload?.head
        ? `https://github.com/${repoName}/commit/${event.payload.head}`
        : url;

      let text = `Pushed to ${shortRepo}`;
      if (count > 0) {
        text = `Pushed ${count === 1 ? "1 commit" : `${count} commits`} to ${shortRepo}`;
      } else if (branch) {
        text = `Pushed to ${shortRepo} (${branch})`;
      }

      let detail = "";
      if (commits[0]?.message) {
        detail = commits[0].message.split("\n")[0];
      } else if (head) {
        detail = branch ? `${branch} · commit ${head}` : `commit ${head}`;
      }

      return {
        ...base,
        badge: "Push",
        text,
        detail,
        url: commitUrl,
      };
    }
    case "CreateEvent": {
      const refType = event.payload?.ref_type ?? "branch";
      const ref = event.payload?.ref ? ` ${event.payload.ref}` : "";
      let text = `Created ${refType}${ref} in ${shortRepo}`;
      if (refType === "repository") {
        text = `Created repository ${shortRepo}`;
      }
      return {
        ...base,
        badge: "Create",
        text,
        detail:
          refType === "branch" && event.payload?.ref
            ? `branch ${event.payload.ref}`
            : "",
      };
    }
    case "PullRequestEvent": {
      const pr = event.payload?.pull_request;
      const isMerged =
        event.payload?.action === "closed" && pr?.merged === true;
      const action = isMerged
        ? "Merged"
        : event.payload?.action === "closed"
          ? "Closed"
          : "Opened";
      return {
        ...base,
        badge: isMerged ? "Merged" : "PR",
        text: `${action} pull request in ${shortRepo}`,
        detail: pr ? `#${pr.number} ${pr.title}` : "",
        url: pr?.html_url ?? url,
      };
    }
    case "ReleaseEvent": {
      const tag = event.payload?.release?.tag_name ?? "";
      return {
        ...base,
        badge: "Release",
        text: `Released ${tag || "new version"} in ${shortRepo}`,
        detail: "",
      };
    }
    case "WatchEvent":
    case "ForkEvent":
      return {
        ...base,
        badge: "Star",
        text: `Starred ${shortRepo}`,
        detail: "",
      };
    default:
      return null;
  }
}

export async function GET(req: Request) {
  let username = "kauxync";
  try {
    const githubSocial = getSocial("github");
    username = new URL(githubSocial.url).pathname.replace(/\//g, "") || "kauxync";
  } catch {
    // default to kauxync
  }

  const { searchParams } = new URL(req.url);
  const userParam = searchParams.get("username");
  if (userParam && /^[a-zA-Z0-9_-]+$/.test(userParam)) {
    username = userParam;
  }

  // Return cached result if fresh
  const now = Date.now();
  if (cachedGithubData && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { success: true, data: cachedGithubData },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "CDN-Cache-Control": "no-store",
        },
      },
    );
  }

  let days: ContributionDay[] = cachedGithubData?.days ?? [];
  let total = cachedGithubData?.total ?? 82;
  let publicRepos = cachedGithubData?.publicRepos ?? 14;
  let events: ActivityItem[] = cachedGithubData?.events ?? [];

  const ghHeaders: Record<string, string> = {
    "User-Agent": siteConfig.url.replace(/^https?:\/\//, ""),
    Accept: "application/vnd.github.v3+json",
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    ghHeaders.Authorization = `Bearer ${token}`;
  }

  // 1. Fetch live contributions from public contributions API
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      {
        headers: { "User-Agent": siteConfig.url.replace(/^https?:\/\//, "") },
        cache: "no-store",
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.contributions) && data.contributions.length > 0) {
        days = data.contributions;
        total =
          data.total?.lastYear ??
          days.reduce((acc, curr) => acc + curr.count, 0);
      }
    }
  } catch (err) {
    console.warn("GitHub contributions API live fetch failed:", err);
  }

  // 2. Fetch live user profile
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: ghHeaders,
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.public_repos === "number") {
        publicRepos = data.public_repos;
      }
    }
  } catch (err) {
    console.warn("GitHub profile live fetch failed:", err);
  }

  // 3. Fetch live public events
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=20`,
      {
        headers: ghHeaders,
        cache: "no-store",
      },
    );
    if (res.ok) {
      const rawEvents = await res.json();
      if (Array.isArray(rawEvents) && rawEvents.length > 0) {
        const parsed = rawEvents
          .map((e: GithubEvent) => parseGithubEvent(e))
          .filter((item): item is ActivityItem => item !== null)
          .slice(0, 6);
        if (parsed.length > 0) {
          events = parsed;
        }
      }
    }
  } catch (err) {
    console.warn("GitHub events live fetch failed:", err);
  }

  // Fallback if empty
  if (days.length === 0) {
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      days.push({
        date: d.toISOString().split("T")[0],
        count: i % 5 === 0 ? 1 : 0,
        level: i % 5 === 0 ? 1 : 0,
      });
    }
  }

  if (events.length === 0) {
    events = [
      {
        id: "ev-1",
        badge: "Push",
        text: "Pushed to kauxync (main)",
        detail: "main · commit c2e4b34",
        createdAt: new Date().toISOString(),
        url: "https://github.com/kauxync/kauxync",
      },
      {
        id: "ev-2",
        badge: "Push",
        text: "Pushed to OmniArticle (main)",
        detail: "main · commit 2f8a45a",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        url: "https://github.com/kauxync/OmniArticle",
      },
    ];
  }

  const result: GithubData = {
    days,
    total,
    publicRepos,
    events,
  };

  // Update memory cache
  cachedGithubData = result;
  lastCacheTimestamp = now;

  return NextResponse.json(
    { success: true, data: result },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
      },
    },
  );
}
