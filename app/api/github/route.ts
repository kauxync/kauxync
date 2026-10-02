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
  badge: string;
}

interface GithubData {
  days: ContributionDay[];
  total: number;
  publicRepos: number;
  events: ActivityItem[];
}

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
      const count = commits.length;
      const detail = commits[0]?.message.split("\n")[0] ?? "";
      return {
        ...base,
        badge: "Push",
        text: `Pushed ${count === 1 ? "1 commit" : `${count} commits`} to ${shortRepo}`,
        detail,
      };
    }
    case "CreateEvent": {
      const refType = event.payload?.ref_type ?? "branch";
      const ref = event.payload?.ref ? ` ${event.payload.ref}` : "";
      return {
        ...base,
        badge: "Create",
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
        badge: "PR",
        text: `${action} pull request in ${shortRepo}`,
        detail: pr ? `#${pr.number} ${pr.title}` : "",
      };
    }
    case "ReleaseEvent": {
      const tag = event.payload?.release?.tag_name ?? "";
      return {
        ...base,
        badge: "Release",
        text: `Released ${tag} in ${shortRepo}`,
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

  let days: ContributionDay[] = [];
  let total = 0;
  let publicRepos = 14;
  let events: ActivityItem[] = [];

  // 1. Fetch live contributions
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
      if (Array.isArray(data.contributions)) {
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
      headers: { "User-Agent": siteConfig.url.replace(/^https?:\/\//, "") },
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
        headers: { "User-Agent": siteConfig.url.replace(/^https?:\/\//, "") },
        cache: "no-store",
      },
    );
    if (res.ok) {
      const rawEvents: GithubEvent[] = await res.json();
      if (Array.isArray(rawEvents)) {
        events = rawEvents
          .map(parseGithubEvent)
          .filter((item): item is ActivityItem => item !== null)
          .slice(0, 6);
      }
    }
  } catch (err) {
    console.warn("GitHub events live fetch failed:", err);
  }

  // Fallback if needed
  if (days.length === 0) {
    total = 81;
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

  const result: GithubData = {
    days,
    total,
    publicRepos,
    events,
  };

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
