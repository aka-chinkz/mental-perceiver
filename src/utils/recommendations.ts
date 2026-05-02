import type { ComputedScores } from "./scoring"
import type { WellnessCategory } from "../data/questions"

export interface Recommendation {
  title: string
  body: string
  icon: "breath" | "sleep" | "journal" | "talk" | "move" | "routine"
}

/**
 * Builds gentle, practical suggestion cards prioritized by weakest areas.
 */
export function pickRecommendations(scores: ComputedScores): Recommendation[] {
  const cats = Object.entries(scores.categoryScores) as [
    WellnessCategory,
    number,
  ][]
  const sorted = [...cats].sort((a, b) => b[1] - a[1])
  const top = new Set(sorted.slice(0, 2).map(([c]) => c))

  const pool: Recommendation[] = []

  if (top.has("stress") || scores.anxietyIndex > 45) {
    pool.push({
      icon: "breath",
      title: "Brief breathing resets",
      body: "Try 4 slow inhales and 6 longer exhales for two minutes — it signals safety to your nervous system.",
    })
  }

  if (top.has("sleep") || scores.categoryScores.sleep > 45) {
    pool.push({
      icon: "sleep",
      title: "Sleep-friendly wind-down",
      body: "Dim screens an hour earlier, keep a consistent wake time, and keep your room cooler if you can.",
    })
  }

  if (
    top.has("mood") ||
    top.has("energy") ||
    scores.depressionIndex > 45
  ) {
    pool.push({
      icon: "journal",
      title: "Gentle journaling",
      body: "Note one small win and one compassionate sentence to yourself — structure without pressure.",
    })
  }

  pool.push({
    icon: "talk",
    title: "Connect with someone you trust",
    body: "Sharing how you’ve been feeling can lighten the mental load—even a short check-in counts.",
  })

  if (top.has("focus")) {
    pool.push({
      icon: "routine",
      title: "Tiny focus blocks",
      body: "One 15-minute stretch with notifications off; then pause. Sustainable beats heroic.",
    })
  }

  if (scores.anxietyIndex < 40 && scores.depressionIndex < 40) {
    pool.unshift({
      icon: "move",
      title: "Light movement breaks",
      body: "Stretch, walk outdoors, or change rooms — micro-movements help mood and clarity.",
    })
  }

  // Unique by title
  const seen = new Set<string>()
  const out: Recommendation[] = []
  for (const r of pool) {
    if (seen.has(r.title)) continue
    seen.add(r.title)
    out.push(r)
    if (out.length >= 4) break
  }
  return out
}
