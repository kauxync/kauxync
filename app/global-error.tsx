"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100svh",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1.5rem",
            maxWidth: "42rem",
            marginInline: "auto",
            padding: "2rem 1.25rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            Error
          </p>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            SOMETHING BROKE
          </h1>
          <p style={{ lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
            An unexpected error occurred. Try again, or head back home.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                minHeight: "3rem",
                padding: "0.8rem 1.7rem",
                border: "2px solid currentColor",
                background: "transparent",
                color: "inherit",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "3rem",
                padding: "0.8rem 1.7rem",
                border: "2px solid currentColor",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Back home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
