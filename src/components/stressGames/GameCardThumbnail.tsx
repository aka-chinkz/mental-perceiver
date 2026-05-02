import { useId } from "react"

/** Card preview matching the breathing activity */
export function BreathingGameThumbnail() {
  const gid = useId().replace(/:/g, "")
  const o = `bt-o-${gid}`
  const i = `bt-i-${gid}`
  const vb = "0 0 120 72"

  return (
    <svg viewBox={vb} className="h-full w-full" fill="none" aria-hidden role="img">
      <defs>
        <linearGradient id={o} x1="35%" y1="0%" x2="65%" y2="100%">
          <stop offset="0%" stopColor="#7FB3D5" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#76D7C4" stopOpacity={0.35} />
        </linearGradient>
        <linearGradient id={i} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#76D7C4" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#C39BD3" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <ellipse cx={60} cy={38} rx={44} ry={28} fill={`url(#${o})`} opacity={0.5} />
      <circle cx={60} cy={38} r={22} stroke={`url(#${i})`} strokeWidth={6} opacity={0.85} />
      <circle cx={60} cy={38} r={12} fill="#76D7C4" fillOpacity={0.35} />
    </svg>
  )
}
