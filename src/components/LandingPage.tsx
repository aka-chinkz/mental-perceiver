import { motion } from "framer-motion"
import { Disclaimer } from "./Disclaimer"
import { ThemeToggle } from "./ThemeToggle"

interface Props {
  onStart: () => void
  onViewSaved?: () => void
  /** Gentle sensory pauses — no scores or timers */
  onOpenRelaxGames?: () => void
}

const pillarEase = [0.22, 1, 0.36, 1] as const

const pillarFade = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i + 0.35, duration: 0.45, ease: pillarEase },
  }),
}

/** Small reassurance chips under the subtitle */
function TrustChips() {
  const chips = [
    "Private · runs in your browser",
    "~5 minute gentle pace",
    "18 mindful questions",
  ]
  return (
    <motion.ul
      initial="hidden"
      animate="show"
      variants={{
        show: {
          transition: { staggerChildren: 0.06 },
        },
      }}
      className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-10"
      aria-label="What to expect"
    >
      {chips.map((label) => (
        <motion.li
          key={label}
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.38, ease: pillarEase },
            },
          }}
          className="rounded-full border border-mp-blue/20 bg-mp-card/85 px-4 py-1.5 text-xs font-medium text-mp-text-secondary shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-mp-card"
        >
          {label}
        </motion.li>
      ))}
    </motion.ul>
  )
}

function PillarCards() {
  const items = [
    {
      title: "Calm pacing",
      body: "One question at a time — no timers, no pressure.",
      tint: "from-mp-teal/15 to-mp-blue/10 border-mp-teal/25",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.65}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: "Insightful reflections",
      body: "See patterns across mood, sleep, energy, focus, and stress.",
      tint: "from-mp-lavender/15 to-mp-blue/10 border-mp-lavender/25",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.65}
          d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h.01M12 14h.01M15 11h.01"
        />
      ),
    },
    {
      title: "You stay in control",
      body: "Save on this device, export PDF, revisit when you choose.",
      tint: "from-mp-sage/20 to-mp-teal/10 border-mp-sage/35",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.65}
          d="M12 11c2.761 0 5-2.015 5-4.5S14.761 2 12 2 7 4.015 7 6.5c0 2.097 2.011 4.069 5 8.43 2.988-4.362 5-6.332 5-8.43zM12 12v9"
        />
      ),
    },
  ]
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4 lg:gap-5">
      {items.map((it, idx) => (
        <motion.div
          key={it.title}
          custom={idx}
          initial="hidden"
          animate="show"
          variants={pillarFade}
          className={`rounded-[18px] border bg-gradient-to-br p-4 lg:p-5 shadow-mp-soft backdrop-blur-sm ${it.tint}`}
        >
          <svg
            className="mb-3 h-8 w-8 text-mp-text stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            {it.icon}
          </svg>
          <p className="font-semibold text-mp-text mb-1.5">{it.title}</p>
          <p className="text-sm text-mp-text-secondary leading-relaxed">{it.body}</p>
        </motion.div>
      ))}
    </div>
  )
}

/** Soft decorative blobs — purely visual, decorative */
function AmbientGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -top-[10%] right-[-15%] h-[380px] w-[380px] rounded-full bg-mp-teal/20 blur-3xl dark:bg-mp-teal/12"
        animate={{ opacity: [0.45, 0.68, 0.45], scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[-18%] h-[340px] w-[340px] rounded-full bg-mp-lavender/18 blur-3xl dark:bg-mp-lavender/12"
        animate={{ opacity: [0.4, 0.62, 0.4], scale: [1.02, 1, 1.02] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[42%] h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-mp-blue/14 blur-[64px] dark:bg-mp-blue/10"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  )
}

export function LandingPage({ onStart, onViewSaved, onOpenRelaxGames }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col mp-gradient-bg overflow-x-hidden">
      <AmbientGlow />

      <header className="relative z-10 flex justify-end px-5 py-5 sm:px-8 lg:px-12">
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex-1 px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 lg:flex-row lg:items-center lg:gap-16 lg:pt-4">
          {/* Primary story */}
          <div className="flex-1 text-center lg:text-left lg:py-8">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-mp-teal mb-5"
            >
              Self-reflection
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-x-4 -inset-y-3 rounded-[28px] bg-mp-card/40 blur-xl dark:bg-white/[0.04] lg:-inset-x-6 lg:-inset-y-4" />

              <h1 className="relative text-[2rem] font-semibold leading-[1.12] tracking-tight text-mp-text sm:text-[2.5rem] sm:leading-[1.1] lg:text-[2.875rem]">
                Take a calm moment to{" "}
                <span className="bg-gradient-to-r from-mp-teal via-mp-blue to-mp-lavender bg-clip-text text-transparent dark:opacity-95">
                  understand how you feel
                </span>
              </h1>

              <p className="relative mt-6 max-w-xl text-lg leading-relaxed text-mp-text-secondary mx-auto lg:mx-0 lg:max-w-lg">
                A quiet, thoughtful check-in across mood, sleep, energy, focus, and stress
                — so patterns feel clearer without judgment or rush.
              </p>
            </motion.div>

            <TrustChips />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="flex flex-col items-center lg:items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02, boxShadow: "0 16px 48px rgba(127, 179, 213, 0.32)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                onClick={onStart}
                className="inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-[18px] bg-gradient-to-r from-mp-blue to-mp-teal px-10 py-3.5 text-base font-semibold text-white shadow-mp-card ring-1 ring-white/25 ring-inset"
              >
                Start assessment
              </motion.button>
              {onViewSaved ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onViewSaved}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[18px] border border-mp-lavender/40 bg-mp-lavender/10 px-7 py-3.5 text-sm font-semibold text-mp-text backdrop-blur-sm hover:bg-mp-lavender/18"
                >
                  View last saved snapshot
                </motion.button>
              ) : null}
              {onOpenRelaxGames ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenRelaxGames}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[18px] border border-mp-teal/35 bg-mp-teal/[0.1] px-7 py-3.5 text-sm font-semibold text-mp-text backdrop-blur-sm hover:bg-mp-teal/18"
                >
                  Relax & unwind
                </motion.button>
              ) : null}
            </motion.div>
          </div>

          {/* Side column: glass panel + pillars */}
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-9 sm:gap-10 lg:gap-11 lg:mx-0 lg:max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[26px] border border-mp-blue/18 bg-mp-card/70 p-6 sm:p-8 shadow-mp-soft backdrop-blur-xl ring-1 ring-white/35 dark:border-white/12 dark:bg-mp-card dark:ring-white/10"
            >
              <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-mp-teal/50 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mp-teal mb-2">
                Your rhythm
              </p>
              <p className="text-lg font-semibold text-mp-text leading-snug mb-4">
                Designed to feel airy, grounding, and easy to revisit.
              </p>
              <ul className="space-y-3 text-sm text-mp-text-secondary">
                <li className="flex gap-3 rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/[0.05]">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-mp-teal" />
                  Progress stays visible at the top — always know where you are.
                </li>
                <li className="flex gap-3 rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/[0.05]">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-mp-lavender" />
                  Results show gentle charts and words — never a clinical label.
                </li>
                <li className="flex gap-3 rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/[0.05]">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-mp-blue" />
                  Dark mode and PDF export keep the experience comfortable day or night.
                </li>
              </ul>
            </motion.div>

            <PillarCards />
          </div>
        </div>

        {/* Disclaimer + footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="mx-auto mt-16 max-w-3xl space-y-6"
        >
          <Disclaimer />

          {!onViewSaved ? (
            <p className="text-center text-xs text-mp-text-secondary/85">
              When you finish, we can save one snapshot locally on this device so you can
              reopen your last reflection anytime.
            </p>
          ) : (
            <p className="text-center text-xs text-mp-text-secondary/85">
              You already have a saved snapshot — use{" "}
              <span className="font-semibold text-mp-text-secondary">View last saved</span>{" "}
              above anytime.
            </p>
          )}

          <p className="text-center text-[11px] text-mp-text-secondary/65 pt-4 border-t border-mp-blue/10 dark:border-white/10">
            Mental Perceiver · Self-reflection only · Not a substitute for emergency or
            professional care.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
