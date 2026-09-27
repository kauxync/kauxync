import { currentlyContent } from "@/config/content";
import { Section } from "@/components/ui/section";

export function Currently() {
  return (
    <Section
      id="currently"
      index={currentlyContent.index}
      heading={currentlyContent.heading}
      variant="blur"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currentlyContent.items.map((item) => (
          <li
            key={item.status}
            className="card card-hover flex items-start gap-3 p-5"
          >
            <span
              aria-hidden
              className="dot-pulse mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <div>
              <p className="text-sm font-semibold tracking-tight">
                {item.status}
              </p>
              <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
