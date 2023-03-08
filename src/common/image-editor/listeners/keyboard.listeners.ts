import { fabric } from 'fabric'

/**
 * Adds a listener to the document for the 'Delete' keydown event.
 * If the active object on the given canvas exist,
 * it is removed from the canvas.
 *
 * @param {fabric.Canvas} canvas
 * - The Fabric.js canvas object to add listner to.
 */

export function setDeleteObjectListener(canvas: fabric.Canvas) {
  document.addEventListener('keydown', event => {
    if (event.key !== 'Delete') return

    const activeObject = canvas.getActiveObject()

    if (!activeObject) return

    canvas.remove(activeObject)
  })
}
