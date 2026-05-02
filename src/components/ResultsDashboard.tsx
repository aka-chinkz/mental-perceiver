import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts"
import { CATEGORY_LABELS, type ResponseValue } from "../data/questions"
import {
  buildInsightText,
  computeScores,
  LEVEL_META,
  levelFromScore,
} from "../utils/scoring"
import { pickRecommendations } from "../utils/recommendations"
import { saveResultsLocally } from "../utils/storage"
import { exportResultsPdf } from "../utils/pdfExport"
import { RecoIcon } from "./recoIcon"
import { Disclaimer } from "./Disclaimer"
import { ThemeToggle } from "./ThemeToggle"

interface Props {
  answers: ResponseValue[]
  onRestart: () => void
  onOpenRelaxGames?: () => void
}

/** Bar fill colors: soft blue & lavender for the two composite scores */
const BAR_COLORS = ["#7FB3D5", "#C39BD3"]

function ScoreCard({
  title,
  score,
  subtitle,
}: {
  title: string
  score: number
  subtitle?: string
}) {
  const band = levelFromScore(score)
  const meta = LEVEL_META[band]
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[18px] border border-mp-blue/15 bg-mp-card backdrop-blur-xl p-5 shadow-mp-card dark:border-white/10"
    >
      <p className="text-sm font-medium text-mp-text-secondary mb-1">{title}</p>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-3xl font-semibold text-mp-text">{score}</span>
        <span className="text-xs text-mp-text-secondary">/ 100</span>
      </div>
      <span
        className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-semibold ${meta.bgClass} ${meta.textClass}`}
      >
        {meta.label} intensity
      </span>
      {subtitle ? (
        <p className="mt-2 text-xs text-mp-text-secondary leading-relaxed">{subtitle}</p>
      ) : null}
    </motion.div>
  )
}

export function ResultsDashboard({ answers, onRestart, onOpenRelaxGames }: Props) {
  const scores = useMemo(() => computeScores(answers), [answers])
  const insight = useMemo(() => buildInsightText(scores), [scores])
  const recs = useMemo(() => pickRecommendations(scores), [scores])
  const exportRootRef = useRef<HTMLDivElement>(null)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  useEffect(() => {
    saveResultsLocally({
      answers: [...answers],
      savedAt: new Date().toISOString(),
    })
  }, [answers])

  const radarData = useMemo(
    () =>
      (Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[]).map((k) => ({
        area: CATEGORY_LABELS[k],
        value: scores.categoryScores[k],
      })),
    [scores]
  )

  const barData = useMemo(
    () => [
      { name: "Anxiety score", score: scores.anxietyIndex },
      { name: "Depression score", score: scores.depressionIndex },
    ],
    [scores]
  )

  const moodLevel = levelFromScore(scores.categoryScores.mood)
  const stressLevel = levelFromScore(scores.categoryScores.stress)
  const anxietyLevel = levelFromScore(scores.anxietyIndex)

  const onExportPdf = useCallback(async () => {
    const el = exportRootRef.current
    if (!el) return
    setPdfError(null)
    setPdfBusy(true)
    try {
      await exportResultsPdf(el, "mental-perceiver-reflection.pdf")
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not create the PDF file."
      setPdfError(msg)
      console.error("PDF export failed:", e)
    } finally {
      setPdfBusy(false)
    }
  }, [])

  return (
    <div className="min-h-screen mp-gradient-bg">
      <header className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-mp-teal">
            Your gentle snapshot
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-mp-text">
            Reflection results
          </h1>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onOpenRelaxGames ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenRelaxGames}
              className="rounded-[14px] border border-mp-teal/35 bg-mp-teal/12 px-4 py-2.5 text-sm font-medium text-mp-text hover:bg-mp-teal/22"
            >
              Relax & unwind
            </motion.button>
          ) : null}
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExportPdf}
            disabled={pdfBusy}
            className="rounded-[14px] border border-mp-lavender/40 bg-mp-lavender/15 px-4 py-2.5 text-sm font-medium text-mp-text hover:bg-mp-lavender/25 disabled:opacity-60"
          >
            {pdfBusy ? "Preparing PDF…" : "Export PDF"}
          </motion.button>
          <ThemeToggle />
        </div>
      </header>
      {pdfError ? (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-4">
          <p
            role="alert"
            className="rounded-[14px] border border-mp-coral/35 bg-mp-coral/15 px-4 py-3 text-sm text-mp-text leading-relaxed"
          >
            {pdfError}{" "}
            <button
              type="button"
              className="font-semibold underline decoration-mp-coral/60 hover:no-underline"
              onClick={() => setPdfError(null)}
            >
              Dismiss
            </button>
          </p>
        </div>
      ) : null}

      <div ref={exportRootRef} className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-6 space-y-8">
        <div className="rounded-[16px] border border-dashed border-mp-teal/40 bg-mp-teal/5 px-4 py-3">
          <p className="text-sm text-mp-text-secondary leading-relaxed">
            Indices below summarize your questionnaire responses only — not a diagnosis.
            Low / mild / moderate / high describe how strong these reflections appear
            <em> relative to this check-in</em>, not clinical severity.
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="text-lg text-mp-text leading-relaxed rounded-[18px] border border-mp-blue/10 bg-mp-card/80 backdrop-blur-md p-6 shadow-mp-soft"
        >
          {insight}
        </motion.p>

        <div className="grid gap-5 sm:grid-cols-3">
          <ScoreCard
            title="Anxiety-related reflection"
            score={scores.anxietyIndex}
            subtitle="Drawn from tension, worry, and focus items in this questionnaire."
          />
          <ScoreCard
            title="Mood reflection"
            score={scores.categoryScores.mood}
            subtitle="How low mood themes showed up over the timeframe you pictured."
          />
          <ScoreCard
            title="Stress & worry"
            score={scores.categoryScores.stress}
            subtitle="Your answers in the dedicated stress cluster."
          />
        </div>

        <div className="rounded-[20px] border border-mp-blue/15 bg-mp-card backdrop-blur-xl p-6 sm:p-8 shadow-mp-card overflow-hidden">
          <h2 className="text-lg font-semibold text-mp-text mb-1">
            Two-lens reflection (not diagnoses)
          </h2>
          <p className="text-sm text-mp-text-secondary mb-6">
            Animated bars compare generalized worry/tension versus mood-energy patterns.
          </p>
          <div className="h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 12, right: 12, left: 4, bottom: 28 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#566573", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(127,179,213,0.3)" }}
                  interval={0}
                  height={48}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#566573", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(127,179,213,0.3)" }}
                  label={{
                    value: "0–100 reflection scale",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#566573",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(127,179,213,0.06)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(127,179,213,0.25)",
                    background: "rgba(247,249,249,0.96)",
                    boxShadow: "0 8px 24px rgba(44,62,80,0.1)",
                  }}
                  formatter={(value) => [
                    `${value ?? 0} / 100`,
                    "Reflection score",
                  ]}
                />
                <Bar
                  dataKey="score"
                  radius={[10, 10, 4, 4]}
                  animationDuration={1100}
                  animationEasing="ease-out"
                >
                  {barData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[20px] border border-mp-teal/20 bg-mp-card backdrop-blur-xl p-6 sm:p-8 shadow-mp-card">
          <h2 className="text-lg font-semibold text-mp-text mb-1">Life areas radar</h2>
          <p className="text-sm text-mp-text-secondary mb-4">
            Each spoke is a self-reported pattern for this window of time — notice shape,
            not “good” or “bad.”
          </p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                <PolarGrid stroke="rgba(127,179,213,0.35)" />
                <PolarAngleAxis
                  dataKey="area"
                  tick={{ fill: "#566573", fontSize: 11 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Reflection"
                  dataKey="value"
                  stroke="#7FB3D5"
                  fill="#76D7C4"
                  fillOpacity={0.42}
                  strokeWidth={2}
                  dot
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-mp-text mb-4">
            Ideas that tend to help
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {recs.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex gap-4 rounded-[18px] border border-mp-sage/30 bg-mp-sage/10 dark:bg-mp-sage/15 p-5 shadow-mp-soft"
              >
                <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-mp-teal/25 text-mp-text">
                  <RecoIcon kind={r.icon} className="h-6 w-6" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-mp-text">{r.title}</h3>
                  <p className="text-sm text-mp-text-secondary mt-1 leading-relaxed">
                    {r.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="rounded-[16px] bg-mp-yellow/25 dark:bg-mp-yellow/10 border border-mp-yellow/40 px-4 py-4">
          <Disclaimer compact />
        </div>

        <div className="flex flex-wrap gap-3 justify-center pb-12">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="rounded-[16px] bg-gradient-to-r from-mp-blue to-mp-teal px-8 py-3.5 text-sm font-semibold text-white shadow-mp-card"
          >
            Start a new check-in
          </motion.button>
        </div>

        {/* Hidden legend for PDF context — helps color-blind readers in print */}
        <p className="text-[10px] text-mp-text-secondary text-center sr-only">
          Mood band: {LEVEL_META[moodLevel].label}. Stress band:{" "}
          {LEVEL_META[stressLevel].label}. Anxiety band: {LEVEL_META[anxietyLevel].label}.
        </p>
      </div>
    </div>
  )
}
