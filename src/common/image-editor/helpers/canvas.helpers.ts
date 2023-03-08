import { fabric } from 'fabric'

/**
 * Checks if an object is within the boundaries of a canvas and translates the
 * canvas viewport if necessary to keep the object within the boundaries.
 *
 * @param canvas - The fabric.js canvas object.
 * @param object - The fabric.js object to check the boundaries of.
 */

export function keepObjectInBoundaries(
  canvas: fabric.Canvas,
  object: fabric.Object,
) {
  if (!object.aCoords || !canvas?.width || !canvas?.height) return

  const { br: bottomRightRaw, tl: topLeftRaw } = object.aCoords

  const viewport = canvas.viewportTransform

  if (!viewport) return

  const bottomRight = fabric.util.transformPoint(bottomRightRaw, viewport)
  const topLeft = fabric.util.transformPoint(topLeftRaw, viewport)

  const { x: left, y: top } = topLeft
  const { x: right, y: bottom } = bottomRight
  const { width, height } = canvas

  /* calculate how far to translate to line up the edge of the object with
  /  the edge of the canvas */
  const deltaLeft = Math.abs(right - width)
  const deltaRight = Math.abs(left)
  const deltaUp = Math.abs(bottom - height)
  const deltaDown = Math.abs(top)

  /* if the object is larger than the canvas, clamp translation such that
     we don't push the opposite boundary past the edge */
  const maxDx = Math.min(deltaLeft, deltaRight)
  const maxDy = Math.min(deltaUp, deltaDown)

  const leftIsOver = left < 0
  const rightIsOver = right > width
  const topIsOver = top < 0
  const bottomIsOver = bottom > height
  const translateLeft = rightIsOver && !leftIsOver
  const translateRight = leftIsOver && !rightIsOver
  const translateUp = bottomIsOver && !topIsOver
  const translateDown = topIsOver && !bottomIsOver

  const dx = translateLeft ? -maxDx : translateRight ? maxDx : 0
  const dy = translateUp ? -maxDy : translateDown ? maxDy : 0

  if (dx || dy) {
    viewport[4] += dx
    viewport[5] += dy
    canvas.renderAll()
  }
}

/**
 * Adjusts the size and position of all objects on the canvas based on the
 * initial dimensions of the canvas.
 *
 * This is useful for maintaining the same size and layout of objects on
 * different screen sizes or after the canvas has been scaled.
 *
 * @param canvas - The Fabric.js canvas object.
 * @param initialWidth
 * - The initial width of the canvas before any scaling or resizing.
 * @param initialHeight
 * - The initial height of the canvas before any scaling or resizing.
 */

export function adjustObjectsSize(
  canvas: fabric.Canvas,
  initialWidth: number,
  initialHeight: number,
) {
  const canvasObjects = canvas.getObjects()

  canvasObjects.forEach(object => {
    if (!canvas?.width || !canvas.height) return

    const scaleX = canvas.width / initialWidth
    const scaleY = canvas.height / initialHeight

    if (!object.left || !object.top || !object.width || !object.height) return

    const left = object.left * scaleX
    const top = object.top * scaleY
    const width = object.width * scaleX
    const height = object.height * scaleY

    object.set({ left, top, width, height })

    if (object instanceof fabric.IText && object.fontSize) {
      object.set('fontSize', object.fontSize * Math.max(scaleX, scaleY))
    }
    object.setCoords()
  })

  canvas.renderAll()
}
