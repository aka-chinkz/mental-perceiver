/** Optional nudge when saved questionnaire stress cluster reads elevated */
export function stressReliefBreathingPrompt(stressReflection: number | null): string | null {
  if (stressReflection == null) return null
  if (stressReflection <= 49) return null
  return "Your last saved reflection leaned toward heavier stress cues — slowing your breath might feel grounding right now."
}
