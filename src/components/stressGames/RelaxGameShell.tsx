import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { ThemeToggle } from "../ThemeToggle"

interface RelaxGameShellProps {
  instruction: string
  onBack: () => void
  children: ReactNode
  /** In-app cues only (e.g. breathing). External embeds omit this. */
  sound?: { enabled: boolean; onToggle: () => void }
}

/**
 * Full-screen calm frame: always-visible Back + optional in-app sound toggle.
 */
export function RelaxGameShell({
  instruction,
  onBack,
  children,
  sound,
}: RelaxGameShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col mp-gradient-bg overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Calming activity"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 right-[-10%] h-72 w-72 rounded-full bg-mp-teal/12 blur-3xl dark:bg-mp-teal/8" />
        <div className="absolute bottom-[-20%] left-[-15%] h-96 w-96 rounded-full bg-mp-lavender/10 blur-3xl" />
      </div>

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-mp-blue/10 bg-mp-card/55 px-4 py-3 backdrop-blur-md sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-[14px] border border-mp-blue/20 bg-mp-card/90 px-4 py-2 text-sm font-semibold text-mp-text backdrop-blur-sm transition-colors hover:border-mp-teal/35 hover:bg-mp-teal/10"
        >
          ← Back
        </button>

        <p className="flex-1 text-center text-sm text-mp-text-secondary min-w-[12rem] px-2 leading-snug">
          {instruction}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {sound ? (
            <button
              type="button"
              onClick={sound.onToggle}
              className="rounded-[14px] border border-mp-lavender/35 bg-mp-lavender/15 px-4 py-2 text-xs font-semibold text-mp-text hover:bg-mp-lavender/22"
              aria-pressed={sound.enabled}
            >
              Sound: {sound.enabled ? "on" : "off"}
            </button>
          ) : null}
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </motion.div>
  )
}
