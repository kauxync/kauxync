import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  external?: boolean;
  "aria-label"?: string;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  ...rest
}: ButtonLinkProps) {
  const className = `btn ${variant === "primary" ? "btn-primary" : "btn-outline"}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}
