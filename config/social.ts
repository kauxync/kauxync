export type SocialIconKey =
  | "github"
  | "linkedin"
  | "instagram"
  | "x"
  | "youtube"
  | "aws"
  | "leetcode"
  | "mail";

export interface SocialLink {
  name: string;
  url: string;
  handle: string;
  icon: SocialIconKey;
  external: boolean;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/kauxync",
    handle: "@kauxync",
    icon: "github",
    external: true,
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/kauxync",
    handle: "/in/kauxync",
    icon: "linkedin",
    external: true,
  },
  {
    name: "Instagram",
    url: "https://instagram.com/kauxync",
    handle: "@kauxync",
    icon: "instagram",
    external: true,
  },
  {
    name: "X",
    url: "https://x.com/kauxync",
    handle: "@kauxync",
    icon: "x",
    external: true,
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@kauxync",
    handle: "@kauxync",
    icon: "youtube",
    external: true,
  },
  {
    name: "AWS Builder ID",
    url: "https://builder.aws.com/community/@kauxync",
    handle: "@kauxync",
    icon: "aws",
    external: true,
  },
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/kauxync/",
    handle: "@kauxync",
    icon: "leetcode",
    external: true,
  },
  {
    name: "Email",
    url: "mailto:owner@kauxync.in",
    handle: "owner@kauxync.in",
    icon: "mail",
    external: false,
  },
];

export function getSocial(icon: SocialIconKey): SocialLink {
  const link = socialLinks.find((item) => item.icon === icon);
  if (!link) throw new Error(`Missing social link: ${icon}`);
  return link;
}
