import type { ReactNode } from "react";
import { AnimateIn } from "@/components/ui/animate-ui";

interface SectionProps {
  id: string;
  index: string;
  heading: string;
  children: ReactNode;
  variant?: "up" | "blur" | "scale";
}

export function Section({ id, index, heading, children, variant = "up" }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-line sm:scroll-mt-20">
      <div className="container-site section-pad">
        <AnimateIn variant={variant} delay={0.05} duration={0.65}>
          <header className="mb-9 md:mb-14">
            <span
              aria-hidden
              className="font-display text-6xl font-bold tracking-tight text-foreground/15 sm:text-7xl"
            >
              {index}
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {heading}
            </h2>
          </header>
        </AnimateIn>

        <AnimateIn variant="up" delay={0.15} duration={0.7}>
          {children}
        </AnimateIn>
      </div>
    </section>
  );
}
