/**
 * Prominent ethics / safety messaging — reused on landing & results.
 */
export function Disclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-center text-sm text-mp-text-secondary leading-relaxed max-w-2xl mx-auto">
        This is not a medical diagnosis tool. It offers self-reflection insights only.
        If you feel overwhelmed, consider reaching out to a mental health professional.
      </p>
    )
  }
  return (
    <div
      className="rounded-[16px] border border-mp-coral/35 bg-mp-coral/10 dark:bg-mp-coral/15 px-5 py-4 text-left shadow-mp-soft"
      role="note"
    >
      <p className="text-sm font-medium text-mp-text mb-1">
        Important: not a diagnostic tool
      </p>
      <p className="text-sm text-mp-text-secondary leading-relaxed">
        Mental Perceiver provides gentle, non-clinical self-reflection only. It does not
        diagnose conditions or replace care from a qualified professional. If you are in
        crisis or feel unsafe, please contact local emergency services or a crisis line
        immediately.
      </p>
      <p className="text-sm text-mp-text-secondary mt-2 leading-relaxed">
        If you&apos;re feeling overwhelmed, consider reaching out to a mental health
        professional — asking for support is a sign of strength.
      </p>
    </div>
  )
}
