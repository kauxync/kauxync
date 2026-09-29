import { siteConfig } from "@/config/site";

export function ProfileAvatar() {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] transition-transform duration-300 hover:rotate-0 -rotate-1">
      {/* Neo-brutalist Washi Tape Sticker at Top */}
      <div
        aria-hidden
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 border-2 border-foreground bg-[#fef08a] dark:bg-[#ca8a04] px-4 py-0.5 text-[0.625rem] font-mono font-bold tracking-widest text-[#854d0e] dark:text-[#fef08a] shadow-[2px_2px_0px_#18181b]"
      >
        DEV // ID: 001
      </div>

      <div className="card-hover border-2 border-foreground bg-[#ffffff] dark:bg-[#121214] p-4 shadow-[8px_8px_0px_#a855f7] dark:shadow-[8px_8px_0px_#7e22ce]">
        {/* Stylized Avatar Illustration Canvas */}
        <div className="relative aspect-square w-full overflow-hidden border-2 border-foreground bg-gradient-to-br from-[#f3e8ff] via-[#e0f2fe] to-[#fef3c7] dark:from-[#2e1065] dark:via-[#082f49] dark:to-[#451a03] p-4 flex flex-col items-center justify-center text-center">
          {/* Geometric Avatar Face */}
          <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_#18181b] dark:shadow-[4px_4px_0px_#ffffff]">
            <span className="font-display text-4xl sm:text-5xl font-black uppercase text-accent tracking-tighter">
              KX
            </span>
            <span
              aria-hidden
              className="absolute -top-2 -right-2 h-4 w-4 border-2 border-foreground bg-[#22c55e]"
              title="Online & Building"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
            <span className="border border-foreground bg-surface px-2 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-foreground">
              TypeScript
            </span>
            <span className="border border-foreground bg-surface px-2 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-foreground">
              Next.js
            </span>
            <span className="border border-foreground bg-surface px-2 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider text-foreground">
              C / Systems
            </span>
          </div>
        </div>

        {/* Identity Details */}
        <div className="mt-3.5 space-y-1 text-center">
          <p className="font-display text-lg font-bold text-foreground">
            {siteConfig.realName}
          </p>
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
            @{siteConfig.name.toLowerCase()} · Full-Stack Builder
          </p>
        </div>

        {/* Location & Status Pill */}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-[0.6875rem] font-mono">
          <span className="flex items-center gap-1 text-muted">
            <span>🇮🇳</span> India (IST)
          </span>
          <span className="font-bold text-[#16a34a] dark:text-[#4ade80] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-ping" />
            Open for Roles
          </span>
        </div>
      </div>
    </div>
  );
}
