import { identityContent } from "@/config/content";
import { Section } from "@/components/ui/section";

export function Identity() {
  return (
    <Section
      id="identity"
      index={identityContent.index}
      heading={identityContent.heading}
      variant="blur"
    >
      <ul className="grid gap-5 sm:grid-cols-3">
        {identityContent.blocks.map((block) => (
          <li
            key={block.title}
            className="card card-hover p-6 sm:p-7"
          >
            <span aria-hidden className="chip">
              {block.index}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">
              {block.title}
            </h3>
            <p className="mt-3 text-[0.975rem] leading-relaxed text-muted">
              {block.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
