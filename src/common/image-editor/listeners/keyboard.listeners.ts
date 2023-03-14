import { fabric } from 'fabric'

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
