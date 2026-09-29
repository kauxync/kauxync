import { siteConfig } from "@/config/site";

const SEPARATOR = "//";

export function Ticker() {
  const words = [
    ...siteConfig.brandStatement
      .split(".")
      .map((word) => word.trim())
      .filter(Boolean),
    siteConfig.name,
    ...siteConfig.identity.split("·").map((word) => word.trim()),
  ];

  const row = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="ticker-row">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="ticker-item">
          <span>{word}</span>
          <span aria-hidden className="ticker-sep">
            {SEPARATOR}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y-2 border-foreground bg-[#fbbf24] dark:bg-[#b45309] py-3 text-[#18181b] dark:text-[#fef3c7] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
