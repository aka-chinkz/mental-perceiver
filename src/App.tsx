import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useState } from "react"
import { LandingPage } from "./components/LandingPage"
import { Questionnaire } from "./components/Questionnaire"
import { ResultsDashboard } from "./components/ResultsDashboard"
import { StressGamesPage } from "./components/stressGames/StressGamesPage"
import { QUESTIONS, type ResponseValue } from "./data/questions"
import { loadSavedResults } from "./utils/storage"

type View = "landing" | "quiz" | "results" | "games"

function isValidSavedAnswers(arr: unknown): arr is ResponseValue[] {
  return (
    Array.isArray(arr) &&
    arr.length === QUESTIONS.length &&
    arr.every((v) => typeof v === "number" && v >= 0 && v <= 3)
  )
}

function readValidatedSnapshot() {
  const raw = loadSavedResults()
  if (!raw || !isValidSavedAnswers(raw.answers)) return null
  return raw
}

/**
 * Top-level flow: landing → one-question-at-a-time quiz → animated results.
 * Optional: reopen the last snapshot saved on this device.
 */
function App() {
  const [view, setView] = useState<View>("landing")
  const [answers, setAnswers] = useState<ResponseValue[] | null>(null)
  const [relaxReturn, setRelaxReturn] = useState<"landing" | "results" | null>(null)

  const savedSnapshot =
    view === "landing" ? readValidatedSnapshot() : null

  const goLanding = useCallback(() => {
    setAnswers(null)
    setView("landing")
  }, [])

  const startFresh = useCallback(() => {
    setAnswers(null)
    setView("quiz")
  }, [])

  const openSaved = useCallback(() => {
    const snap = readValidatedSnapshot()
    if (!snap) return
    setAnswers(snap.answers as ResponseValue[])
    setView("results")
  }, [])

  const completeQuiz = useCallback((final: ResponseValue[]) => {
    setAnswers(final)
    setView("results")
  }, [])

  const openRelax = useCallback((from: "landing" | "results") => {
    setRelaxReturn(from)
    setView("games")
  }, [])

  const closeRelax = useCallback(() => {
    if (relaxReturn === "results" && answers) setView("results")
    else setView("landing")
    setRelaxReturn(null)
  }, [relaxReturn, answers])

  return (
    <div className="min-h-screen bg-mp-bg text-mp-text antialiased selection:bg-mp-lavender/30">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <LandingPage
              onStart={startFresh}
              onViewSaved={savedSnapshot ? openSaved : undefined}
              onOpenRelaxGames={() => openRelax("landing")}
            />
          </motion.div>
        ) : null}

        {view === "quiz" ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
          >
            <Questionnaire
              onComplete={completeQuiz}
              onBack={goLanding}
            />
          </motion.div>
        ) : null}

        {view === "results" && answers ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResultsDashboard
              answers={answers}
              onRestart={goLanding}
              onOpenRelaxGames={() => openRelax("results")}
            />
          </motion.div>
        ) : null}

        {view === "games" ? (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <StressGamesPage onBack={closeRelax} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default App
