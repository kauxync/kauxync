import { NextResponse } from "next/server";
import { getSocial } from "@/config/social";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

interface LeetcodeData {
  submissions: LeetcodeSubmission[];
  stats: LeetcodeStats;
  calendar: Record<string, number>;
}

async function fetchFromOfficialGraphql(username: string): Promise<LeetcodeData | null> {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent": siteConfig.url.replace(/^https?:\/\//, ""),
    },
    body: JSON.stringify({
      query: `
        query getUserLeetcodeProfile($username: String!) {
          recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
          }
          matchedUser(username: $username) {
            submissionCalendar
            profile {
              ranking
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username },
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = await response.json();
  const submissions: LeetcodeSubmission[] =
    json.data?.recentSubmissionList ?? [];
  const acList: { difficulty: string; count: number }[] =
    json.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum ?? [];
  const ranking = json.data?.matchedUser?.profile?.ranking;
  const rawCalendar = json.data?.matchedUser?.submissionCalendar;
  let calendar: Record<string, number> = {};

  if (typeof rawCalendar === "string") {
    try {
      calendar = JSON.parse(rawCalendar);
    } catch {
      calendar = {};
    }
  }

  const getCount = (diff: string) =>
    acList.find((i) => i.difficulty.toLowerCase() === diff.toLowerCase())?.count ?? 0;

  if (submissions.length > 0 || acList.length > 0 || Object.keys(calendar).length > 0) {
    return {
      submissions: submissions.slice(0, 8),
      stats: {
        all: getCount("all"),
        easy: getCount("easy"),
        medium: getCount("medium"),
        hard: getCount("hard"),
        ranking,
      },
      calendar,
    };
  }

  return null;
}

async function fetchFromPublicProxy(username: string): Promise<LeetcodeData | null> {
  const response = await fetch(
    `https://leetcode-api-faisalshohag.vercel.app/${username}`,
    { cache: "no-store" },
  );

  if (!response.ok) return null;

  const d = await response.json();
  if (typeof d.totalSolved !== "number") return null;

  const rawSubmissions = Array.isArray(d.recentSubmissions)
    ? d.recentSubmissions
    : [];

  return {
    submissions: rawSubmissions.slice(0, 8).map((s: {
      title?: string;
      titleSlug?: string;
      timestamp?: string | number;
      statusDisplay?: string;
      lang?: string;
    }) => ({
      title: s.title || "Solved Problem",
      titleSlug: s.titleSlug || "problem",
      timestamp: String(s.timestamp || Math.floor(Date.now() / 1000)),
      statusDisplay: s.statusDisplay || "Accepted",
      lang: s.lang || "c",
    })),
    stats: {
      all: Number(d.totalSolved) || 0,
      easy: Number(d.easySolved) || 0,
      medium: Number(d.mediumSolved) || 0,
      hard: Number(d.hardSolved) || 0,
      ranking: typeof d.ranking === "number" ? d.ranking : undefined,
    },
    calendar:
      typeof d.submissionCalendar === "object" && d.submissionCalendar !== null
        ? d.submissionCalendar
        : {},
  };
}

export async function GET(req: Request) {
  let username = "kauxync";
  try {
    const leetcodeSocial = getSocial("leetcode");
    const match = new URL(leetcodeSocial.url).pathname.split("/").filter(Boolean);
    username =
      match[match.length - 1] === "u"
        ? match[0]
        : match[match.length - 1] || "kauxync";
    if (username.startsWith("u")) username = match[1] || "kauxync";
  } catch {
    // default to kauxync
  }

  const { searchParams } = new URL(req.url);
  const userParam = searchParams.get("username");
  if (userParam && /^[a-zA-Z0-9_-]+$/.test(userParam)) {
    username = userParam;
  }

  let data: LeetcodeData | null = null;

  // 1. Try official GraphQL endpoint
  try {
    data = await fetchFromOfficialGraphql(username);
  } catch (err) {
    console.warn("LeetCode GraphQL direct fetch failed:", err);
  }

  // 2. Fallback to public CORS proxy if blocked/empty
  if (!data || data.stats.all === 0) {
    try {
      const proxyData = await fetchFromPublicProxy(username);
      if (proxyData && proxyData.stats.all > 0) {
        data = proxyData;
      }
    } catch (err) {
      console.warn("LeetCode public proxy fetch failed:", err);
    }
  }

  if (!data) {
    // Minimum fallback if network completely down
    data = {
      submissions: [
        {
          title: "Two Sum",
          titleSlug: "two-sum",
          timestamp: "1790909245",
          statusDisplay: "Accepted",
          lang: "c",
        },
      ],
      stats: {
        all: 1,
        easy: 1,
        medium: 0,
        hard: 0,
        ranking: 5000001,
      },
      calendar: {
        "1790899200": 1,
      },
    };
  }

  return NextResponse.json(
    { success: true, data },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
      },
    },
  );
}
