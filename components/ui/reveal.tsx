"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "blur" | "scale" | "fade" | "left" | "right";
  duration?: number;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  duration = 0.65,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  const variantStyles = {
    up: {
      initial: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
    blur: {
      initial: { opacity: 0, y: 16, filter: "blur(8px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
    scale: {
      initial: { opacity: 0, scale: 0.94, y: 14 },
      visible: { opacity: 1, scale: 1, y: 0 },
    },
    fade: {
      initial: { opacity: 0 },
      visible: { opacity: 1 },
    },
    left: {
      initial: { opacity: 0, x: -24 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: 24 },
      visible: { opacity: 1, x: 0 },
    },
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const { initial, visible } = variantStyles[variant] ?? variantStyles.up;

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration,
        delay: delay > 0 ? delay / 1000 : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
