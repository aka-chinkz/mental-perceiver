import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const MODERN_COLOR_FUNCS = /oklab|oklch|color-mix\s*\(|lab\s*\(|lch\s*\(|\bcolor\s*\(/i

/** Convert any color syntax the browser understands into rgb()/hex for html2canvas. */
function normalizeColorThroughCanvas(cssColor: string): string | null {
  try {
    const cnv = document.createElement("canvas")
    cnv.width = cnv.height = 1
    const ctx = cnv.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = "#000"
    ctx.fillStyle = cssColor
    const out = String(ctx.fillStyle)
    if (MODERN_COLOR_FUNCS.test(out)) return null
    return out
  } catch {
    return null
  }
}

function hexFallback(forProp: string): string {
  if (forProp.includes("border") || forProp === "outline-color") {
    return "rgba(127, 179, 213, 0.35)"
  }
  if (forProp.includes("background")) return "#f7f9f9"
  return "#2c3e50"
}

function resolveCssColor(dashedProp: string, raw: string): string {
  const trimmed = raw.trim()
  const probe = document.createElement("div")
  probe.style.visibility = "hidden"
  probe.style.position = "fixed"
  probe.style.left = "-9999px"
  probe.style.setProperty(dashedProp, trimmed)
  document.body.appendChild(probe)
  try {
    const parsed = getComputedStyle(probe).getPropertyValue(dashedProp).trim()
    if (parsed && !MODERN_COLOR_FUNCS.test(parsed)) return parsed
  } finally {
    document.body.removeChild(probe)
  }

  const viaCanvas =
    normalizeColorThroughCanvas(trimmed) ??
    normalizeColorThroughCanvas(trimmed.replace(/\s+/g, " "))
  if (viaCanvas && !MODERN_COLOR_FUNCS.test(viaCanvas)) return viaCanvas

  return hexFallback(dashedProp)
}

/**
 * Returns a Safe `prop:value` declaration, or null to drop entirely.
 */
function sanitizeDeclaration(propertyName: string, rawValue: string): string | null {
  const value = rawValue.trim()
  if (!value || value === "inherit") return `${propertyName}:${value}`

  if (!MODERN_COLOR_FUNCS.test(value)) {
    return `${propertyName}:${rawValue}`
  }

  /* Gradients/shorthands referencing lab() stops — drop; html2canvas rejects them outright */
  if (propertyName === "background" || propertyName === "background-image") {
    return null
  }
  if (
    propertyName === "box-shadow" ||
    propertyName === "text-shadow" ||
    propertyName === "filter" ||
    propertyName === "backdrop-filter"
  ) {
    return `${propertyName}:none`
  }
  if (propertyName === "border-image" || propertyName === "border-image-source") {
    return null
  }

  const paintProps =
    /color$/i.test(propertyName) ||
    propertyName.includes("outline") ||
    propertyName.startsWith("background") ||
    propertyName === "fill" ||
    propertyName === "stroke" ||
    propertyName === "stop-color"

  if (paintProps) {
    const safe = resolveCssColor(propertyName, value)
    if (MODERN_COLOR_FUNCS.test(safe)) return `${propertyName}:${hexFallback(propertyName)}`
    return `${propertyName}:${safe}`
  }

  return null
}

function purgeAllStylesheets(doc: Document): void {
  doc.querySelectorAll('link[rel="stylesheet"]').forEach((n) => {
    if (n.parentNode) n.parentNode.removeChild(n)
  })
  doc.querySelectorAll("style").forEach((st) => {
    if (st.parentNode) st.parentNode.removeChild(st)
  })
  /*
   * Vite/Chromium sometimes attach constructable sheets that still contain Tailwind /
   * cross-space color tokens — html2canvas parses these when matching rules onto nodes.
   */
  try {
    ;(doc as Document & { adoptedStyleSheets?: CSSStyleSheet[] }).adoptedStyleSheets = []
  } catch {
    /* unsupported in older Safari */
  }
}

/** Recharts / SVG defs use gradient stops whose resolved stop-color still serializes as oklab(). */
function copySvgGradientStop(origin: SVGStopElement, cloned: SVGStopElement): void {
  cloned.removeAttribute("style")
  cloned.removeAttribute("class")
  const cs = window.getComputedStyle(origin as Element)
  let stopColor = cs.getPropertyValue("stop-color").trim()
  if (!stopColor) stopColor = origin.getAttribute("stop-color")?.trim() ?? ""
  if (MODERN_COLOR_FUNCS.test(stopColor)) {
    stopColor = resolveCssColor("stop-color", stopColor)
  }
  if (MODERN_COLOR_FUNCS.test(stopColor)) stopColor = hexFallback("stop-color")
  cloned.setAttribute("stop-color", stopColor)
  const off = origin.getAttribute("offset")
  if (off) cloned.setAttribute("offset", off)
}

function svgPresentationSnapshot(oSvg: SVGElement, cSvg: SVGElement): void {
  const cs = window.getComputedStyle(oSvg as Element)
  for (const attr of ["fill", "stroke", "stroke-width", "opacity"] as const) {
    let v = cs.getPropertyValue(attr === "stroke-width" ? "stroke-width" : attr).trim()
    if (!v) continue
    if (attr !== "opacity" && v === "none") continue
    if (attr !== "stroke-width" && MODERN_COLOR_FUNCS.test(v)) {
      const s = normalizeColorThroughCanvas(v) ?? hexFallback("fill")
      v = MODERN_COLOR_FUNCS.test(s) ? hexFallback("fill") : s
    }
    cSvg.setAttribute(attr, v)
  }
}

function flattenHtmlElement(oEl: HTMLElement, cEl: HTMLElement): void {
  cEl.removeAttribute("class")

  const cs = window.getComputedStyle(oEl)
  const declarations: string[] = []

  for (let idx = 0; idx < cs.length; idx++) {
    const name = cs.item(idx)
    if (!name || name.startsWith("--")) continue

    const raw = cs.getPropertyValue(name)
    if (!raw.trim()) continue

    const priority = cs.getPropertyPriority(name)
    const decl = sanitizeDeclaration(name, raw)
    if (!decl) continue

    declarations.push(decl + (priority === "important" ? " !important" : ""))
  }

  const clean = declarations.filter((d) => !MODERN_COLOR_FUNCS.test(d))
  if (clean.length > 0) cEl.setAttribute("style", clean.join(";"))
  else cEl.removeAttribute("style")
}

/** Remove any declaration slice that somehow still mentions lab(...) */
function scrubInlineLabs(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("*[style]").forEach((node) => {
    const sty = node.getAttribute("style")
    if (!sty || !MODERN_COLOR_FUNCS.test(sty)) return
    const next = sty
      .split(";")
      .map((p) => p.trim())
      .filter((chunk) => chunk.length > 0 && !MODERN_COLOR_FUNCS.test(chunk))
      .join(";")
    if (next) node.setAttribute("style", next)
    else node.removeAttribute("style")
  })
}

function flattenSubtreeForCapture(originalRoot: HTMLElement, clonedRoot: HTMLElement): void {
  const oAll: Element[] = [originalRoot, ...originalRoot.querySelectorAll("*")]
  const cAll: Element[] = [clonedRoot, ...clonedRoot.querySelectorAll("*")]
  const n = Math.min(oAll.length, cAll.length)

  for (let i = 0; i < n; i++) {
    const origin = oAll[i]
    const cloneNode = cAll[i]

    if (origin instanceof SVGStopElement && cloneNode instanceof SVGStopElement) {
      copySvgGradientStop(origin, cloneNode)
      continue
    }

    if (origin instanceof HTMLElement && cloneNode instanceof HTMLElement) {
      flattenHtmlElement(origin, cloneNode)
      continue
    }

    if (origin instanceof SVGElement && cloneNode instanceof SVGElement) {
      svgPresentationSnapshot(origin, cloneNode)
      cloneNode.removeAttribute("class")
    }
  }
}

export async function exportResultsPdf(
  element: HTMLElement,
  filename = "wellness-self-reflection.pdf"
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#f7f9f9",
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight,
    foreignObjectRendering: false,
    onclone: (clonedDoc, clonedElement) => {
      purgeAllStylesheets(clonedDoc)
      flattenSubtreeForCapture(element, clonedElement as HTMLElement)
      scrubInlineLabs(clonedElement as HTMLElement)
    },
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width + 40, canvas.height + 80],
  })
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(
    "Self-reflection snapshot — not a medical record.",
    20,
    canvas.height + 52
  )
  pdf.addImage(imgData, "PNG", 20, 20, canvas.width, canvas.height)
  pdf.save(filename)
}
