import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { ThemeToggle } from "../ThemeToggle"
import { Disclaimer } from "../Disclaimer"
import { BreathingGameThumbnail } from "./GameCardThumbnail"
import { GameCard } from "./GameCard"
import { RelaxGameShell } from "./RelaxGameShell"
import { readSavedStressReflection } from "./savedStressSignal"
import { BreathingCircle } from "./games/BreathingCircle"
import { CrazyGamesIframe } from "./games/CrazyGamesIframe"
import { stressReliefBreathingPrompt } from "./gameMeta"
import {
  COLOR_WATER_SORT_EMBED_URL,
  COLOR_WATER_SORT_PAGE_URL,
  COLOR_WATER_SORT_THUMB,
  STONE_GRASS_EMBED_URL,
  STONE_GRASS_PAGE_URL,
  STONE_GRASS_THUMB,
} from "./crazyGamesEmbeds"

interface StressGamesPageProps {
  onBack: () => void
}

type RelaxSession = "breathing" | "stoneGrass" | "colorWaterSort"

const BREATH_CARD = {
  title: "Breathing circle",
  hint: "Follow the drift of the circle — adjust speed anytime.",
  description:
    "Slow expansion and softness for your inhale and exhale. No timers or scores.",
  accent:
    "border-mp-teal/30 shadow-[inset_0_0_32px_rgba(118,215,196,0.12)]",
} as const

const STONE_CARD = {
  title: "Stone Grass: Mowing Simulator",
  hint:
    "Relaxing mowing sim from CrazyGames — move at any pace that feels calming to you.",
  description:
    "Mindless motion and cheerful scenery. Sound comes from the game; take breaks anytime.",
  accent:
    "border-mp-blue/25 shadow-[inset_0_0_24px_rgba(127,179,213,0.12)] overflow-hidden",
} as const

const WATER_CARD = {
  title: "Color Water Sort 3D",
  hint:
    "Sort colored water at your own pace — no need to chase levels or stars for a calm session.",
  description:
    "Simple pours and glass tubes. Step away whenever you like; audio lives in the player.",
  accent:
    "border-mp-lavender/30 shadow-[inset_0_0_24px_rgba(195,155,211,0.12)] overflow-hidden",
} as const

/**
 * Breathing plus optional CrazyGames-hosted titles — framed as unwinding, not pressure.
 */
export function StressGamesPage({ onBack }: StressGamesPageProps) {
  const stressSignal = readSavedStressReflection()
  const tipLine = stressReliefBreathingPrompt(stressSignal)
  const stressed = typeof stressSignal === "number" && stressSignal > 49

  const [soundEnabled, setSoundEnabled] = useState(false)
  const [session, setSession] = useState<RelaxSession | null>(null)

  return (
    <div className="relative min-h-screen mp-gradient-bg overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative"
      >
        <header className="flex flex-wrap justify-between gap-3 px-5 py-5 sm:px-8 lg:px-12 max-w-6xl mx-auto items-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-[14px] border border-mp-blue/20 bg-mp-card/85 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:border-mp-teal/35 hover:bg-mp-teal/12"
          >
            ← Back
          </button>
          <ThemeToggle />
        </header>

        <main className="px-5 pb-20 sm:px-8 lg:px-12 max-w-6xl mx-auto">
          <div className="text-center lg:text-left mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-mp-teal mb-3">
              Soft focus
            </p>
            <h1 className="text-[1.95rem] sm:text-[2.25rem] font-semibold tracking-tight text-mp-text">
              Take a Moment to Unwind
            </h1>
            <p className="mt-4 text-lg text-mp-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A breathing rhythm and optional mellow games hosted by CrazyGames — pause anytime
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start text-xs font-medium">
              <span className="rounded-full border border-mp-sage/30 bg-mp-sage/10 px-4 py-1.5 text-mp-text-secondary">
                Your pace counts more than scores
              </span>
              <span className="rounded-full border border-mp-blue/22 bg-mp-blue/[0.08] px-4 py-1.5 text-mp-text-secondary">
                Embedded games use CrazyGames controls and audio
              </span>
            </div>
          </div>

          {tipLine ? (
            <motion.aside
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="mb-10 rounded-[18px] border border-mp-teal/30 bg-mp-teal/[0.1] px-5 py-4 text-sm text-mp-text leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              {tipLine}
            </motion.aside>
          ) : null}

          <motion.div
            variants={{
              show: {
                transition: { staggerChildren: 0.08 },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: "easeInOut" },
                },
              }}
            >
              <GameCard
                accentClass={BREATH_CARD.accent}
                recommended={stressed}
                title={BREATH_CARD.title}
                description={BREATH_CARD.description}
                thumbnail={<BreathingGameThumbnail />}
                onSelect={() => setSession("breathing")}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: "easeInOut", delay: 0.04 },
                },
              }}
            >
              <GameCard
                accentClass={STONE_CARD.accent}
                thumbnailFill
                title={STONE_CARD.title}
                description={STONE_CARD.description}
                thumbnail={
                  <img
                    src={STONE_GRASS_THUMB}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                    width={400}
                    height={240}
                    loading="lazy"
                    decoding="async"
                  />
                }
                onSelect={() => setSession("stoneGrass")}
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.42, ease: "easeInOut", delay: 0.08 },
                },
              }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <GameCard
                accentClass={WATER_CARD.accent}
                thumbnailFill
                title={WATER_CARD.title}
                description={WATER_CARD.description}
                thumbnail={
                  <img
                    src={COLOR_WATER_SORT_THUMB}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                    width={400}
                    height={240}
                    loading="lazy"
                    decoding="async"
                  />
                }
                onSelect={() => setSession("colorWaterSort")}
              />
            </motion.div>
          </motion.div>

          <div className="mt-14 mx-auto max-w-2xl">
            <Disclaimer compact />
            <p className="mt-6 text-xs text-mp-text-secondary/85 leading-relaxed text-center lg:text-left">
              The breathing pause is sensory only—not therapy.&nbsp;
              <span className="font-medium text-mp-text-secondary">Stone Grass</span> © FreePlay LLC
              (<a
                href={STONE_GRASS_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-mp-teal/45 hover:text-mp-teal"
              >
                CrazyGames
              </a>
              );{" "}
              <span className="font-medium text-mp-text-secondary">Color Water Sort 3D</span> ©
              Famobi (
              <a
                href={COLOR_WATER_SORT_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-mp-teal/45 hover:text-mp-teal"
              >
                CrazyGames
              </a>
              ). Embedded play uses their hosting and privacy terms. If overwhelm feels urgent,
              reach for offline support first.
            </p>
          </div>
        </main>
      </motion.div>

      <AnimatePresence>
        {session === "breathing" ? (
          <RelaxGameShell
            key="breathing"
            instruction={`${BREATH_CARD.title} · ${BREATH_CARD.hint}`}
            onBack={() => setSession(null)}
            sound={{
              enabled: soundEnabled,
              onToggle: () => setSoundEnabled((s) => !s),
            }}
          >
            <BreathingCircle soundEnabled={soundEnabled} />
          </RelaxGameShell>
        ) : null}
        {session === "stoneGrass" ? (
          <RelaxGameShell
            key="stoneGrass"
            instruction={`${STONE_CARD.title} · ${STONE_CARD.hint}`}
            onBack={() => setSession(null)}
          >
            <CrazyGamesIframe
              title="Stone Grass: Mowing Simulator"
              embedUrl={STONE_GRASS_EMBED_URL}
              pageUrl={STONE_GRASS_PAGE_URL}
            />
          </RelaxGameShell>
        ) : null}
        {session === "colorWaterSort" ? (
          <RelaxGameShell
            key="colorWaterSort"
            instruction={`${WATER_CARD.title} · ${WATER_CARD.hint}`}
            onBack={() => setSession(null)}
          >
            <CrazyGamesIframe
              title="Color Water Sort 3D"
              embedUrl={COLOR_WATER_SORT_EMBED_URL}
              pageUrl={COLOR_WATER_SORT_PAGE_URL}
            />
          </RelaxGameShell>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
