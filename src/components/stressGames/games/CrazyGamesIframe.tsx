interface CrazyGamesIframeProps {
  title: string
  embedUrl: string
  /** Official game page — new tab + noscript fallback */
  pageUrl: string
}

/** Shared embed chrome for CrazyGames WebGL / HTML5 titles */
export function CrazyGamesIframe({ title, embedUrl, pageUrl }: CrazyGamesIframeProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-2 pb-3 pt-2 sm:px-4">
      <iframe
        title={title}
        src={embedUrl}
        className="w-full flex-1 min-h-[52vh] sm:min-h-[60vh] rounded-2xl border border-mp-blue/18 bg-mp-bg shadow-inner dark:border-white/15"
        allow="fullscreen; autoplay; gamepad; clipboard-read; clipboard-write"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p className="shrink-0 px-2 text-center text-[11px] leading-relaxed text-mp-text-secondary">
        Hosted by CrazyGames ·{" "}
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-mp-teal underline decoration-mp-teal/40 underline-offset-2 hover:no-underline"
        >
          Open game page (new tab)
        </a>
        {" · "}Audio and settings are handled inside the player.
      </p>
      <noscript className="px-4 text-center text-sm text-mp-text-secondary">
        This game requires JavaScript. Visit{" "}
        <a href={pageUrl} className="text-mp-teal underline">
          the game page
        </a>{" "}
        to play.
      </noscript>
    </div>
  )
}
