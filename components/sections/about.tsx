import { aboutContent } from "@/config/content";
import { Section } from "@/components/ui/section";

export function About() {
  return (
    <Section
      id="about"
      index={aboutContent.index}
      heading={aboutContent.heading}
    >
      <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed text-foreground/85 sm:text-xl">
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
