import { Hero } from "@/components/sections/hero";
import { Ticker } from "@/components/ui/ticker";
import { About } from "@/components/sections/about";
import { Identity } from "@/components/sections/identity";
import { Philosophy } from "@/components/sections/philosophy";
import { Technology } from "@/components/sections/technology";
import { FeaturedWork } from "@/components/sections/featured-work";
import { Timeline } from "@/components/sections/timeline";
import { GithubContributions } from "@/components/sections/github-contributions";
import { GithubActivity } from "@/components/sections/github-activity";
import { LatestWriting } from "@/components/sections/latest-writing";
import { Currently } from "@/components/sections/currently";
import { Guestbook } from "@/components/sections/guestbook";
import { Connect } from "@/components/sections/connect";
import { TerminalModal } from "@/components/ui/terminal-modal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Identity />
      <Technology />
      <FeaturedWork />
      <Philosophy />
      <Timeline />
      <GithubContributions />
      <GithubActivity />
      <LatestWriting />
      <Currently />
      <Guestbook />
      <Connect />
      <TerminalModal />
    </>
  );
}
