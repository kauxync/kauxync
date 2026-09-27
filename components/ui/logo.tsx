import Image from "next/image";

interface LogoProps {
  className?: string;
  eager?: boolean;
}

export function SiteLogo({ className = "", eager = false }: LogoProps) {
  return (
    <span className={`relative block ${className}`}>
      <Image
        src="/logo/kauxync-white.svg"
        alt="Kauxync"
        width={730}
        height={40}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        unoptimized
        className="block h-auto w-full dark:hidden"
      />
      <Image
        src="/logo/kauxync-dark.svg"
        alt=""
        aria-hidden="true"
        width={730}
        height={40}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        unoptimized
        className="hidden h-auto w-full dark:block"
      />
    </span>
  );
}

export function SiteLogoMark({ className = "", eager = false }: LogoProps) {
  return (
    <span className={`relative block ${className}`}>
      <Image
        src="/logo/kauxync-white.svg"
        alt="Kauxync"
        width={730}
        height={40}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        unoptimized
        className="block h-auto w-full dark:hidden"
      />
      <Image
        src="/logo/kauxync-dark.svg"
        alt=""
        aria-hidden="true"
        width={730}
        height={40}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        unoptimized
        className="hidden h-auto w-full dark:block"
      />
    </span>
  );
}
