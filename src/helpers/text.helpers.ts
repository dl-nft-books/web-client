const canvas = document.createElement('canvas')

export function getTextWidth(text: string, font: string): number {
  const context = canvas.getContext('2d')

  if (!context) return 0

  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

function getCssStyle(element: HTMLElement, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop)
}

export function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
  const fontSize = getCssStyle(el, 'font-size') || '16px'
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

  return `${fontWeight} ${fontSize} ${fontFamily}`
}
