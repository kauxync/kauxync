"use client";

import {
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface Card3DProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
}

export function Card3D({
  children,
  className = "",
  containerClassName = "",
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  ...props
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  // Glare position
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    x.set(clientX / rect.width);
    y.set(clientY / rect.height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  if (prefersReduced) {
    return <div className={`${containerClassName} ${className}`} {...props}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative [perspective:1000px] ${containerClassName}`}
      {...props}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scale : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative transition-shadow duration-300 will-change-transform ${className}`}
      >
        {children}

        {/* 3D Specular Glare Reflection Layer */}
        {glare && isHovered && (
          <motion.div
            aria-hidden
            style={{
              background: `radial-gradient(circle 220px at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 70%)`,
            }}
            className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] mix-blend-overlay dark:mix-blend-screen"
          />
        )}
      </motion.div>
    </div>
  );
}

interface Card3DItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  translateZ?: number;
}

export function Card3DItem({
  children,
  className = "",
  translateZ = 30,
  ...props
}: Card3DItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
