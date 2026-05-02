import { QUESTIONS, type ResponseValue } from "../../data/questions"
import { computeScores } from "../../utils/scoring"
import { loadSavedResults } from "../../utils/storage"

function isValidSavedAnswers(arr: unknown): arr is ResponseValue[] {
  return (
    Array.isArray(arr) &&
    arr.length === QUESTIONS.length &&
    arr.every((v) => typeof v === "number" && v >= 0 && v <= 3)
  )
}

/** Stress category reflection 0–100 from last locally saved snapshot, or null */
export function readSavedStressReflection(): number | null {
  const raw = loadSavedResults()
  if (!raw || !isValidSavedAnswers(raw.answers)) return null
  return computeScores(raw.answers).categoryScores.stress
}
