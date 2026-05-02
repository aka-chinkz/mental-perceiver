/** Inline SVG icons for recommendation cards */
import type { SVGProps } from "react"

export function IconBreath(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 14c3-8 13-8 16 0" strokeLinecap="round" />
      <path d="M8 10h2M14 10h2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  )
}

export function IconSleep(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" />
    </svg>
  )
}

export function IconJournal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" />
      <path d="M9 10h7M9 14h5" strokeLinecap="round" />
    </svg>
  )
}

export function IconTalk(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M21 15a4 4 0 0 1-4 4H9l-4 3v-4H5a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6z" strokeLinecap="round" />
    </svg>
  )
}

export function IconMove(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 22V9M12 9l6-4M12 9L6 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21l3-8M19 21h-9" strokeLinecap="round" />
    </svg>
  )
}

export function IconRoutine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 3" strokeLinecap="round" />
    </svg>
  )
}
