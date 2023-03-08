import { fabric } from 'fabric'
import { Ref } from 'vue'

/**
 * Sets up listeners for canvas selection events and updates the value of the
 * provided activeObject ref accordingly.
 *
 * @param canvas
 * - The fabric.js canvas object to listen for selection events on.
 * @param activeObject
 * - A ref object that will hold the currently selected object on the canvas.
 */

export function setSelectionListeners(
  canvas: fabric.Canvas,
  activeObject: Ref<fabric.Object | null>,
) {
  canvas.on('selection:created', event => {
    if (!event.selected) return

    activeObject.value = event.selected[0]
  })

  canvas.on('selection:updated', event => {
    if (!event.selected) return

    activeObject.value = event.selected[0]
  })

  canvas.on('selection:cleared', () => {
    activeObject.value = null
  })
}
