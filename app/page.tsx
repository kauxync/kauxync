import { Hero } from "@/components/sections/hero";
import { Ticker } from "@/components/ui/ticker";
import { About } from "@/components/sections/about";
import { Identity } from "@/components/sections/identity";
import { Technology } from "@/components/sections/technology";
import { FeaturedWork } from "@/components/sections/featured-work";
import { LatestWriting } from "@/components/sections/latest-writing";
import { Currently } from "@/components/sections/currently";
import { Connect } from "@/components/sections/connect";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Identity />
      <Technology />
      <FeaturedWork />
      <LatestWriting />
      <Currently />
      <Connect />
    </>
  );
}
