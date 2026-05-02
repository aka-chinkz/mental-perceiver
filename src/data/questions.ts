/**
 * Wellness self-reflection questionnaire.
 * Responses are ordinal 0–3 (frequency over ~the past two weeks).
 * Aggregate scores drive dashboard visuals—not clinical diagnosis.
 */

export type WellnessCategory =
  | "mood"
  | "sleep"
  | "energy"
  | "focus"
  | "stress"

export interface QuestionDef {
  id: string
  text: string
  category: WellnessCategory
  /** Included in Depression composite (PHQ-style reflection). */
  inDepressionIndex: boolean
  /** Included in Anxiety composite (GAD-style reflection). */
  inAnxietyIndex: boolean
}

export const OPTION_LABELS = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
] as const

export type ResponseValue = 0 | 1 | 2 | 3

export const QUESTIONS: QuestionDef[] = [
  // Mood — 4
  {
    id: "m1",
    text: "How often have you felt down, low, hopeless, or empty?",
    category: "mood",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "m2",
    text: "How often have you had little interest or pleasure in activities you usually enjoy?",
    category: "mood",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "m3",
    text: "How often have you felt numb, disconnected, or emotionally flat?",
    category: "mood",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "m4",
    text: "How often have you felt tearful or more easily upset than usual?",
    category: "mood",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  // Sleep — 3
  {
    id: "s1",
    text: "How often have you had trouble falling asleep, staying asleep, or waking too early?",
    category: "sleep",
    inDepressionIndex: true,
    inAnxietyIndex: true,
  },
  {
    id: "s2",
    text: "How often have you felt tired or unrested even after sleep?",
    category: "sleep",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "s3",
    text: "How often has disrupted sleep carried into your daytime energy or mood?",
    category: "sleep",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  // Energy — 3
  {
    id: "e1",
    text: "How often have you felt drained or low on energy?",
    category: "energy",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "e2",
    text: "How often have everyday tasks felt heavier or more exhausting?",
    category: "energy",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  {
    id: "e3",
    text: "How often have you lacked motivation to start or engage with your day?",
    category: "energy",
    inDepressionIndex: true,
    inAnxietyIndex: false,
  },
  // Focus — 3
  {
    id: "f1",
    text: "How often has it been hard to concentrate or think clearly?",
    category: "focus",
    inDepressionIndex: true,
    inAnxietyIndex: true,
  },
  {
    id: "f2",
    text: "How often have you felt mentally scattered or forgetful?",
    category: "focus",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
  {
    id: "f3",
    text: "How often have you struggled to follow through or finish tasks?",
    category: "focus",
    inDepressionIndex: true,
    inAnxietyIndex: true,
  },
  // Stress / worry — 5
  {
    id: "w1",
    text: "How often have you felt nervous, tense, or on edge?",
    category: "stress",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
  {
    id: "w2",
    text: "How often have worries felt hard to control or out of proportion?",
    category: "stress",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
  {
    id: "w3",
    text: "How often have you felt unable to pause worried thoughts?",
    category: "stress",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
  {
    id: "w4",
    text: "How often have physical signs of tension shown up (e.g., jaw, shoulders, breathing)?",
    category: "stress",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
  {
    id: "w5",
    text: "How often have surprises or uncertainties felt unusually overwhelming?",
    category: "stress",
    inDepressionIndex: false,
    inAnxietyIndex: true,
  },
]

export const CATEGORY_LABELS: Record<WellnessCategory, string> = {
  mood: "Mood",
  sleep: "Sleep",
  energy: "Energy",
  focus: "Focus",
  stress: "Stress & worry",
}
