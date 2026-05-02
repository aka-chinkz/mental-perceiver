import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  OPTION_LABELS,
  QUESTIONS,
  type ResponseValue,
} from "../data/questions"
import { ThemeToggle } from "./ThemeToggle"

interface Props {
  onComplete: (answers: ResponseValue[]) => void
  onBack: () => void
}

export function Questionnaire({ onComplete, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<ResponseValue[]>(
    () =>
      Array.from({ length: QUESTIONS.length }, () => 0 as ResponseValue)
  )
  /** If the user retrains the last answer, replace the pending completion snapshot. */
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (index < QUESTIONS.length - 1 && completeTimerRef.current !== null) {
      window.clearTimeout(completeTimerRef.current)
      completeTimerRef.current = null
    }
  }, [index])

  useEffect(() => {
    return () => {
      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current)
        completeTimerRef.current = null
      }
    }
  }, [])

  const q = QUESTIONS[index]
  const progress = ((index + 1) / QUESTIONS.length) * 100

  const select = useCallback(
    (value: ResponseValue) => {
      let nextAnswers: ResponseValue[] = []

      setAnswers((prev) => {
        nextAnswers = [...prev]
        nextAnswers[index] = value
        return nextAnswers
      })

      /* Sync flush guarantees `nextAnswers` is populated here (React invokes updater synchronously). */
      const isLast = index >= QUESTIONS.length - 1
      if (!isLast) {
        window.setTimeout(() => setIndex((i) => i + 1), 220)
        return
      }

      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current)
      }
      completeTimerRef.current = window.setTimeout(() => {
        completeTimerRef.current = null
        onComplete(nextAnswers as ResponseValue[])
      }, 280)
    },
    [index, onComplete]
  )

  const goBackQuestion = () => {
    if (index > 0) setIndex((i) => i - 1)
    else onBack()
  }

  return (
    <div className="min-h-screen mp-gradient-bg flex flex-col">
      <header className="flex items-center justify-between gap-3 p-4 sm:p-6">
        <button
          type="button"
          onClick={goBackQuestion}
          className="text-sm font-medium text-mp-text-secondary hover:text-mp-text transition-colors rounded-xl px-3 py-2 hover:bg-mp-blue/10"
        >
          ← {index === 0 ? "Home" : "Previous"}
        </button>
        <ThemeToggle />
      </header>

      <div className="px-4 sm:px-8 max-w-2xl mx-auto w-full flex-1 flex flex-col pb-12">
        <div className="h-2 rounded-full bg-mp-blue/15 overflow-hidden mb-10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-mp-blue to-mp-teal"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
        </div>
        <p className="text-sm text-mp-text-secondary mb-2">
          Question {index + 1} of {QUESTIONS.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-mp-text leading-snug mb-10">
              {q.text}
            </h2>

            <div className="space-y-3">
              {(OPTION_LABELS as readonly string[]).map((label, val) => {
                const selected = answers[index] === val
                return (
                  <motion.button
                    key={label}
                    type="button"
                    layout
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => select(val as ResponseValue)}
                    className={[
                      "w-full text-left rounded-[16px] border px-5 py-4 transition-all duration-200",
                      selected
                        ? "border-mp-teal bg-mp-teal/20 shadow-mp-soft ring-2 ring-mp-teal/40"
                        : "border-mp-blue/20 bg-mp-card/90 backdrop-blur-md shadow-mp-card hover:border-mp-lavender/40 hover:bg-white/80 dark:hover:bg-mp-card",
                    ].join(" ")}
                  >
                    <span className="font-medium text-mp-text">{label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
