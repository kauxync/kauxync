"use client";

import {
  type ReactNode,
  type HTMLAttributes,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  motion,
  type HTMLMotionProps,
  type Variants,
  useInView,
  useReducedMotion,
} from "motion/react";

/* -------------------------------------------------------------------------- */
/*                                ANIMATION VARIANTS                           */
/* -------------------------------------------------------------------------- */

export const easeSpring: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeBouncy: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { stagger?: number; delay?: number } = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? 0.09,
      delayChildren: custom.delay ?? 0.05,
    },
  }),
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeSpring },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeSpring },
  },
};

export const blurInVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: easeSpring },
  },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeSpring },
  },
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easeSpring },
  },
};

export const badgePopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 280,
    },
  },
};

const VARIANT_MAP = {
  up: fadeUpVariants,
  fade: fadeInVariants,
  scale: scaleUpVariants,
  blur: blurInVariants,
  left: slideLeftVariants,
  right: slideRightVariants,
  badge: badgePopVariants,
} as const;

const INITIAL_STATES = {
  up: { opacity: 0, y: 24 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.94, y: 16 },
  blur: { opacity: 0, y: 16, filter: "blur(8px)" },
  left: { opacity: 0, x: -24 },
  right: { opacity: 0, x: 24 },
  badge: { opacity: 0, scale: 0.82, y: 8 },
} as const;

const VISIBLE_STATES = {
  up: { opacity: 1, y: 0 },
  fade: { opacity: 1 },
  scale: { opacity: 1, scale: 1, y: 0 },
  blur: { opacity: 1, y: 0, filter: "blur(0px)" },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  badge: { opacity: 1, scale: 1, y: 0 },
} as const;

/* -------------------------------------------------------------------------- */
/*                                ANIMATE STAGGER                              */
/* -------------------------------------------------------------------------- */

interface AnimateStaggerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  viewportAmount?: number;
  as?: "div" | "ul" | "ol" | "dl" | "section" | "nav";
}

export function AnimateStagger({
  children,
  stagger = 0.08,
  delay = 0.05,
  className = "",
  viewportAmount = 0.15,
  as = "div",
  ...props
}: AnimateStaggerProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    if (as === "ul") return <ul className={className} {...props}>{children}</ul>;
    if (as === "ol") return <ol className={className} {...props}>{children}</ol>;
    if (as === "dl") return <dl className={className} {...props}>{children}</dl>;
    if (as === "section") return <section className={className} {...props}>{children}</section>;
    if (as === "nav") return <nav className={className} {...props}>{children}</nav>;
    return <div className={className} {...props}>{children}</div>;
  }

  const commonProps = {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: viewportAmount },
    variants: staggerContainerVariants,
    custom: { stagger, delay },
    className,
  };

  if (as === "ul") return <motion.ul {...commonProps}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...commonProps}>{children}</motion.ol>;
  if (as === "dl") return <motion.dl {...commonProps}>{children}</motion.dl>;
  if (as === "section") return <motion.section {...commonProps}>{children}</motion.section>;
  if (as === "nav") return <motion.nav {...commonProps}>{children}</motion.nav>;
  return <motion.div {...commonProps}>{children}</motion.div>;
}

/* -------------------------------------------------------------------------- */
/*                                 ANIMATE ITEM                                */
/* -------------------------------------------------------------------------- */

interface AnimateItemProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: "up" | "fade" | "scale" | "blur" | "left" | "right" | "badge";
  className?: string;
  as?: "div" | "li" | "span" | "p";
}

export function AnimateItem({
  children,
  variant = "up",
  className = "",
  as = "div",
  ...props
}: AnimateItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    if (as === "li") return <li className={className} {...props}>{children}</li>;
    if (as === "span") return <span className={className} {...props}>{children}</span>;
    if (as === "p") return <p className={className} {...props}>{children}</p>;
    return <div className={className} {...props}>{children}</div>;
  }

  const commonProps = {
    variants: VARIANT_MAP[variant],
    className,
  };

  if (as === "li") return <motion.li {...commonProps}>{children}</motion.li>;
  if (as === "span") return <motion.span {...commonProps}>{children}</motion.span>;
  if (as === "p") return <motion.p {...commonProps}>{children}</motion.p>;
  return <motion.div {...commonProps}>{children}</motion.div>;
}

/* -------------------------------------------------------------------------- */
/*                                  ANIMATE IN                                 */
/* -------------------------------------------------------------------------- */

interface AnimateInProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: "up" | "fade" | "scale" | "blur" | "left" | "right" | "badge";
  delay?: number;
  duration?: number;
  className?: string;
  viewportAmount?: number;
  as?: "div" | "section" | "nav" | "p";
}

export function AnimateIn({
  children,
  variant = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  viewportAmount = 0.15,
  as = "div",
  ...props
}: AnimateInProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    if (as === "section") return <section className={className} {...props}>{children}</section>;
    if (as === "nav") return <nav className={className} {...props}>{children}</nav>;
    if (as === "p") return <p className={className} {...props}>{children}</p>;
    return <div className={className} {...props}>{children}</div>;
  }

  const commonProps = {
    initial: INITIAL_STATES[variant],
    whileInView: VISIBLE_STATES[variant],
    viewport: { once: true, amount: viewportAmount },
    transition: {
      duration,
      delay,
      ease: variant === "badge" ? easeBouncy : easeSpring,
    },
    className,
  };

  if (as === "section") return <motion.section {...commonProps}>{children}</motion.section>;
  if (as === "nav") return <motion.nav {...commonProps}>{children}</motion.nav>;
  if (as === "p") return <motion.p {...commonProps}>{children}</motion.p>;
  return <motion.div {...commonProps}>{children}</motion.div>;
}

/* -------------------------------------------------------------------------- */
/*                                ANIMATE TEXT                                 */
/* -------------------------------------------------------------------------- */

interface AnimateTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function AnimateText({
  text,
  className = "",
  wordClassName = "",
  delay = 0.05,
  stagger = 0.04,
  as = "p",
}: AnimateTextProps) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");
  const Tag = as;

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.25em]">
          <motion.span
            variants={{
              hidden: { opacity: 0, y: "100%" },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.55,
                  ease: easeSpring,
                },
              },
            }}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                ANIMATE CARD                                 */
/* -------------------------------------------------------------------------- */

interface AnimateCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverScale?: number;
  hoverY?: number;
}

export function AnimateCard({
  children,
  className = "",
  delay = 0,
  hoverScale = 1.015,
  hoverY = -4,
  ...props
}: AnimateCardProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{
        y: hoverY,
        scale: hoverScale,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.55, delay, ease: easeSpring }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ANIMATE COUNTER                               */
/* -------------------------------------------------------------------------- */

interface AnimateCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (val: number) => string;
}

export function AnimateCounter({
  value,
  duration = 1.2,
  className = "",
  formatter = (v) => Math.round(v).toLocaleString("en-US"),
}: AnimateCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      const timer = setTimeout(() => setDisplayValue(value), 0);
      return () => clearTimeout(timer);
    }

    if (!isInView) return;

    const start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let frameId: number;
    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = start + (value - start) * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, duration, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {formatter(displayValue)}
    </span>
  );
}
