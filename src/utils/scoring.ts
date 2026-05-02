import type { WellnessCategory } from "../data/questions"
import { QUESTIONS, type ResponseValue } from "../data/questions"

/** Map raw sum to 0–100 for charting */
function normalize(sum: number, maxPossible: number): number {
  if (maxPossible <= 0) return 0
  return Math.round((sum / maxPossible) * 100)
}

export type LevelBand = "low" | "mild" | "moderate" | "high"

export function levelFromScore(score0to100: number): LevelBand {
  if (score0to100 <= 24) return "low"
  if (score0to100 <= 49) return "mild"
  if (score0to100 <= 74) return "moderate"
  return "high"
}

export const LEVEL_META: Record<
  LevelBand,
  { label: string; textClass: string; bgClass: string }
> = {
  low: {
    label: "Low",
    textClass: "text-green-700 dark:text-mp-sage",
    bgClass: "bg-mp-sage/40 dark:bg-mp-sage/25",
  },
  mild: {
    label: "Mild",
    textClass: "text-amber-800 dark:text-mp-yellow",
    bgClass: "bg-mp-yellow/50 dark:bg-mp-yellow/20",
  },
  moderate: {
    label: "Moderate",
    textClass: "text-orange-800 dark:text-orange-200",
    bgClass: "bg-orange-300/40 dark:bg-orange-400/20",
  },
  high: {
    label: "High",
    textClass: "text-rose-800 dark:text-mp-coral",
    bgClass: "bg-mp-level-high/50 dark:bg-rose-900/35",
  },
}

export interface ComputedScores {
  /** 0–100 reflection signal for low mood / anhedonia / fatigue cluster */
  depressionIndex: number
  /** 0–100 reflection signal for worry / tension / hyperarousal cluster */
  anxietyIndex: number
  /** Per-category 0–100 for radar axes */
  categoryScores: Record<WellnessCategory, number>
}

/**
 * Computes indices from aligned answers array (same order as QUESTIONS).
 */
export function computeScores(answers: ResponseValue[]): ComputedScores {
  const vals = QUESTIONS.map((_, i) => answers[i] ?? 0)

  let depSum = 0
  let depMax = 0
  let anxSum = 0
  let anxMax = 0

  QUESTIONS.forEach((q, i) => {
    const v = vals[i]
    if (q.inDepressionIndex) {
      depSum += v
      depMax += 3
    }
    if (q.inAnxietyIndex) {
      anxSum += v
      anxMax += 3
    }
  })

  const categoryScores: Record<WellnessCategory, number> = {
    mood: 0,
    sleep: 0,
    energy: 0,
    focus: 0,
    stress: 0,
  }
  const catKeys = Object.keys(categoryScores) as WellnessCategory[]
  catKeys.forEach((cat) => {
    const idxs = QUESTIONS.map((q, i) => (q.category === cat ? i : -1)).filter(
      (i) => i >= 0
    )
    const sum = idxs.reduce((a, i) => a + vals[i], 0)
    const max = idxs.length * 3
    categoryScores[cat] = normalize(sum, max)
  })

  return {
    depressionIndex: normalize(depSum, depMax),
    anxietyIndex: normalize(anxSum, anxMax),
    categoryScores,
  }
}

/** Warm, non-diagnostic interpretation lines based on composite ranges */
export function buildInsightText(scores: ComputedScores): string {
  const { depressionIndex: d, anxietyIndex: a } = scores
  const parts: string[] = []

  if (a <= 34 && d <= 34) {
    parts.push(
      "Your responses overall suggest a relatively steady emotional baseline lately, with manageable stress and mood patterns."
    )
  } else {
    if (a >= d + 15) {
      parts.push(
        "Your responses suggest you may have been carrying elevated worry, tension, or vigilance recently—like your mind or body stays braced."
      )
    } else if (d >= a + 15) {
      parts.push(
        "Your responses suggest you may have been moving through stretches of lower mood, drained energy, or reduced enjoyment—signals worth noticing with kindness."
      )
    } else {
      parts.push(
        "Your responses suggest a mix of emotional fatigue and heightened stress—they often travel together during demanding chapters."
      )
    }
    if (d > 49 || a > 49) {
      parts.push(
        "These reflections are invitations to pause and care for yourself—not a verdict on who you are."
      )
    }
  }

  return parts.join(" ")
}
