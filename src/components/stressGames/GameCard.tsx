import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GameCardProps {
  title: string
  description: string
  /** Wide visual preview above the title */
  thumbnail: ReactNode
  /** Accent ring / glow tint classes for thumbnail frame */
  accentClass: string
  recommended?: boolean
  thumbnailFill?: boolean
  onSelect: () => void
}

/**
 * Calm launcher tile — hover lift without competitive framing.
 */
export function GameCard({
  title,
  description,
  thumbnail,
  accentClass,
  recommended,
  thumbnailFill = false,
  onSelect,
}: GameCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{
        y: -6,
        transition: { duration: 0.35, ease: "easeInOut" },
      }}
      whileTap={{ scale: 0.988, transition: { duration: 0.22, ease: "easeInOut" } }}
      className={`relative flex w-full flex-col gap-5 rounded-[18px] border border-mp-blue/14 bg-mp-card/80 p-6 text-left shadow-mp-soft backdrop-blur-md outline-none ring-1 ring-white/35 transition-shadow duration-300 ease-in-out hover:shadow-[0_20px_50px_-12px_rgba(127,179,213,0.35)] focus-visible:ring-2 focus-visible:ring-mp-teal/50 dark:bg-mp-card dark:ring-white/10 ${recommended ? "border-mp-teal/30 ring-mp-teal/25" : ""}`}
    >
      {recommended ? (
        <span className="absolute right-3 top-3 z-[1] rounded-full border border-mp-teal/35 bg-mp-teal/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mp-teal">
          For you
        </span>
      ) : null}

      <motion.div
        {...(thumbnailFill ? {} : { "aria-hidden": true })}
        className={`relative aspect-[120/72] w-full overflow-hidden rounded-2xl border bg-gradient-to-br from-mp-blue/[0.08] via-mp-teal/[0.06] to-mp-lavender/[0.07] shadow-inner backdrop-blur-sm dark:from-mp-blue/[0.05] dark:via-mp-teal/[0.04] dark:to-mp-lavender/[0.05] ${thumbnailFill ? "p-0" : "px-8 py-4"} ${accentClass}`}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {thumbnail}
      </motion.div>

      <div>
        <h3 className="text-lg font-semibold text-mp-text">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-mp-text-secondary">{description}</p>
      </div>

      <motion.span
        className="mt-0 text-xs font-medium text-mp-teal"
        initial={{ opacity: 0.75 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        Open softly →
      </motion.span>
    </motion.button>
  )
}
