import type { SVGProps } from "react"
import type { Recommendation } from "../utils/recommendations"
import {
  IconBreath,
  IconJournal,
  IconMove,
  IconRoutine,
  IconSleep,
  IconTalk,
} from "./Icons"

type Kind = Recommendation["icon"]

/** Maps recommendation slug to the matching illustrative icon component. */
export function RecoIcon({
  kind,
  ...props
}: { kind: Kind } & SVGProps<SVGSVGElement>) {
  switch (kind) {
    case "breath":
      return <IconBreath {...props} />
    case "sleep":
      return <IconSleep {...props} />
    case "journal":
      return <IconJournal {...props} />
    case "talk":
      return <IconTalk {...props} />
    case "move":
      return <IconMove {...props} />
    case "routine":
      return <IconRoutine {...props} />
    default:
      return <IconBreath {...props} />
  }
}
