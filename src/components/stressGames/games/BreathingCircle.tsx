import { motion, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { playSoftChime, playWaterRipple } from "../relaxSounds"

type Phase = "inhale" | "holdIn" | "exhale" | "holdOut"

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "Inhale…",
  holdIn: "Hold…",
  exhale: "Exhale…",
  holdOut: "Rest…",
}

/** Full breath ~6.5s — slow, predictable; no scoring */
const DUR: Record<Phase, number> = {
  inhale: 2.6,
  holdIn: 0.75,
  exhale: 2.6,
  holdOut: 0.75,
}

const ORDER: Phase[] = ["inhale", "holdIn", "exhale", "holdOut"]

const SCALE: Record<Phase, number> = {
  inhale: 1.12,
  holdIn: 1.12,
  exhale: 0.88,
  holdOut: 0.88,
}

interface BreathingCircleProps {
  soundEnabled: boolean
}

export function BreathingCircle({ soundEnabled }: BreathingCircleProps) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>("inhale")
  const idxRef = useRef(0)
  const timersRef = useRef<number[]>([])

  const advance = useCallback(() => {
    idxRef.current = (idxRef.current + 1) % ORDER.length
    const next = ORDER[idxRef.current]!
    setPhase(next)
    if (!soundEnabled) return
    if (next === "inhale") playWaterRipple(true)
    if (next === "exhale") playSoftChime(true)
  }, [soundEnabled])

  useEffect(() => {
    if (reduceMotion) return
    const clear = () => {
      timersRef.current.forEach((id) => window.clearTimeout(id))
      timersRef.current = []
    }
    clear()
    const ms = Math.round(DUR[phase] * 1000)
    const id = window.setTimeout(advance, ms)
    timersRef.current.push(id)
    return clear
  }, [phase, advance, reduceMotion])

  if (reduceMotion) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <p className="max-w-sm text-lg text-mp-text-secondary leading-relaxed">
          Find a comfortable breath. Inhale gently through the nose, exhale a little longer through
          the mouth — no need to match a shape on screen.
        </p>
        <div className="h-40 w-40 rounded-full border-2 border-mp-teal/40 bg-mp-teal/10" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-8">
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="text-xl font-medium text-mp-text sm:text-2xl"
      >
        {PHASE_LABEL[phase]}
      </motion.p>

      <div className="relative flex h-[min(52vw,280px)] w-[min(52vw,280px)] items-center justify-center">
        <motion.div
          className="absolute rounded-full border border-mp-blue/25 bg-mp-blue/5"
          style={{ width: "100%", height: "100%" }}
          aria-hidden
        />
        <motion.div
          className="rounded-full bg-gradient-to-br from-mp-teal/45 to-mp-lavender/35 shadow-[0_0_60px_rgba(118,215,196,0.25)]"
          initial={false}
          animate={{ scale: SCALE[phase] }}
          transition={{
            duration: DUR[phase],
            ease: "easeInOut",
          }}
          style={{ width: "58%", height: "58%" }}
        />
      </div>

      <p className="max-w-md text-center text-sm text-mp-text-secondary leading-relaxed">
        There’s nothing to time perfectly — let the circle suggest a pace, and adjust if your body
        wants something slower.
      </p>
    </div>
  )
}
