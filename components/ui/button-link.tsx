import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  external?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  ...rest
}: ButtonLinkProps) {
  const combinedClassName = `btn ${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={combinedClassName} {...rest}>
      {children}
    </a>
  );
}
