import { fabric } from 'fabric'

enum ARROW_KEYS {
  left = 'ArrowLeft',
  up = 'ArrowUp',
  right = 'ArrowRight',
  down = 'ArrowDown',
}

/**
 * Adds a listener to the document for the 'Delete' keydown event.
 * If the active object on the given canvas exist,
 * it is removed from the canvas.
 *
 * @param canvas
 * - The Fabric.js canvas object to add listner to.
 */

export function setDeleteObjectListener(canvas: fabric.Canvas) {
  document.addEventListener('keyup', event => {
    if (event.key !== 'Delete') return

    const activeObjects = canvas.getActiveObjects()
    if (!activeObjects.length) return

    canvas.discardActiveObject()

    activeObjects.forEach(object => {
      canvas.remove(object)
    })
  })
}

export function setMoveObjectsListener(canvas: fabric.Canvas, moveStep = 1) {
  document.addEventListener('keydown', event => {
    event.preventDefault()

    if (!Object.values(ARROW_KEYS).includes(event.key as unknown as ARROW_KEYS))
      return

    const activeObjects = canvas.getActiveObjects()
    if (!activeObjects.length) return

    activeObjects.forEach(object => {
      if (!object.top || !object.left) return

      switch (event.key) {
        case ARROW_KEYS.up:
          object.set({
            top: object.top - moveStep,
          })
          break
        case ARROW_KEYS.down:
          object.set({
            top: object.top + moveStep,
          })
          break
        case ARROW_KEYS.left:
          object.set({
            left: object.left - moveStep,
          })
          break
        case ARROW_KEYS.right:
          object.set({
            left: object.left + moveStep,
          })
          break
        default:
          break
      }

      canvas.renderAll()
    })
  })
}
