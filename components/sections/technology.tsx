import { technologyContent } from "@/config/content";
import { Section } from "@/components/ui/section";

export function Technology() {
  return (
    <Section
      id="technology"
      index={technologyContent.index}
      heading={technologyContent.heading}
    >
      <ul className="divide-y divide-line border-y border-line">
        {technologyContent.groups.map((group) => (
          <li
            key={group.label}
            className="grid gap-2 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-8 sm:py-5"
          >
            <span className="eyebrow translate-y-[2px]">{group.label}</span>
            <p className="flex flex-wrap items-baseline gap-y-2.5 text-[0.975rem] leading-6 sm:text-base">
              {group.items.map((item, index) => (
                <span key={item} className="flex items-baseline">
                  {item}
                  {index < group.items.length - 1 ? (
                    <span aria-hidden className="mx-3 text-muted/60">
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
