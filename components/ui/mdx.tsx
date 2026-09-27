import { Children, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { slugify } from "@/lib/post-utils";

function MdxLink({
  href = "",
  children,
  ...rest
}: ComponentProps<"a">): ReactNode {
  const external = /^https?:\/\//.test(href);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

export const mdxComponents = {
  a: MdxLink,
  h2: MdxH2,
};

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : "",
    )
    .join("");
}

function MdxH2({ children, ...rest }: ComponentProps<"h2">): ReactNode {
  const id = slugify(textOf(children));
  return (
    <h2 id={id === "" ? undefined : id} {...rest}>
      {children}
    </h2>
  );
}
