const KEY = "mental-perceiver-results-v1"

export interface StoredResultPayload {
  answers: number[]
  savedAt: string
}

export function saveResultsLocally(payload: StoredResultPayload): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

export function loadSavedResults(): StoredResultPayload | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as StoredResultPayload
  } catch {
    return null
  }
}
