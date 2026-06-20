import { PIXEL_SCALE, scaledPx } from '../../constants/pixelScale'

export type SpeechBubbleSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface SpeechBubbleLayout {
  width: number
  height: number
  paddingX: number
  paddingTop: number
  paddingBottom: number
}

export const SPEECH_BUBBLE_LAYOUT: Record<SpeechBubbleSize, SpeechBubbleLayout> = {
  small: {
    width: 182,
    height: 132,
    paddingX: 14,
    paddingTop: 12,
    paddingBottom: 22,
  },
  medium: {
    width: 294,
    height: 113,
    paddingX: 14,
    paddingTop: 10,
    paddingBottom: 18,
  },
  large: {
    width: 294,
    height: 170,
    paddingX: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },
  xlarge: {
    width: 400,
    height: 400,
    paddingX: 56,
    paddingTop: 68,
    paddingBottom: 119,
  },
}

const FONT_SIZE = 12 * PIXEL_SCALE
const LINE_HEIGHT = 19 * PIXEL_SCALE
const FONT = `${FONT_SIZE}px "Dogica Pixel Bold", monospace`

function contentBox(size: SpeechBubbleSize) {
  const layout = SPEECH_BUBBLE_LAYOUT[size]
  return {
    maxWidth: scaledPx(layout.width - layout.paddingX * 2),
    maxHeight: scaledPx(
      layout.height - layout.paddingTop - layout.paddingBottom,
    ),
  }
}

function wrapParagraph(
  paragraph: string,
  maxWidth: number,
  context: CanvasRenderingContext2D,
): string[] {
  const words = paragraph.split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['']

  const lines: string[] = []
  let current = words[0]

  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`
    if (context.measureText(next).width <= maxWidth) {
      current = next
    } else {
      lines.push(current)
      current = words[i]
    }
  }

  lines.push(current)
  return lines
}

function measureWrappedText(
  text: string,
  maxWidth: number,
  context: CanvasRenderingContext2D,
): { width: number; height: number; lineCount: number } {
  const paragraphs = text.split('\n')
  const lines = paragraphs.flatMap((paragraph) =>
    paragraph.length === 0
      ? ['']
      : wrapParagraph(paragraph, maxWidth, context),
  )

  let width = 0
  for (const line of lines) {
    width = Math.max(width, context.measureText(line).width)
  }

  return {
    width,
    height: lines.length * LINE_HEIGHT,
    lineCount: lines.length,
  }
}

const MAX_LINES: Record<SpeechBubbleSize, number> = {
  small: 2,
  medium: 2,
  large: 4,
  xlarge: 6,
}

function bumpBubbleSize(size: SpeechBubbleSize): SpeechBubbleSize {
  if (size === 'small') return 'medium'
  if (size === 'medium') return 'large'
  if (size === 'large') return 'xlarge'
  return 'xlarge'
}

function estimateBubbleSize(text: string): SpeechBubbleSize {
  const normalized = text.trim()
  const length = normalized.replace(/\s+/g, ' ').length
  const explicitLines = normalized.split('\n').length

  if (explicitLines >= 4) return 'xlarge'
  if (explicitLines >= 3) return 'large'
  if (length <= 16 && explicitLines <= 1) return 'small'
  if (length <= 34 && explicitLines <= 2) return 'medium'
  if (length <= 52 && explicitLines <= 3) return 'large'
  return 'xlarge'
}

function pickByMeasurement(
  text: string,
  context: CanvasRenderingContext2D,
): SpeechBubbleSize {
  const sizes: SpeechBubbleSize[] = ['small', 'medium', 'large', 'xlarge']
  let picked: SpeechBubbleSize = 'xlarge'

  for (const size of sizes) {
    const { maxWidth, maxHeight } = contentBox(size)
    const measured = measureWrappedText(text, maxWidth, context)
    if (measured.width <= maxWidth && measured.height <= maxHeight) {
      picked = size
      break
    }
  }

  while (picked !== 'xlarge') {
    const { maxWidth } = contentBox(picked)
    const { lineCount } = measureWrappedText(text, maxWidth, context)
    if (lineCount <= MAX_LINES[picked]) break
    picked = bumpBubbleSize(picked)
  }

  return picked
}

export function pickSpeechBubbleSize(text: string): SpeechBubbleSize {
  const normalized = text.trim()
  if (!normalized) return 'small'

  if (typeof document === 'undefined') {
    return estimateBubbleSize(normalized)
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return estimateBubbleSize(normalized)

  context.font = FONT
  return pickByMeasurement(normalized, context)
}
