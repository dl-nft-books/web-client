import { fabric } from 'fabric'
import { useCanvasOperations } from '@image-editor/composables'
import { History } from '@image-editor/helpers'

enum ARROW_KEYS {
  left = 'ArrowLeft',
  up = 'ArrowUp',
  right = 'ArrowRight',
  down = 'ArrowDown',
}

enum KEYBOARD_KEYS {
  c = 'c',
  v = 'v',
  z = 'z',
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
  const { deleteObjects } = useCanvasOperations(canvas)

  document.addEventListener('keyup', event => {
    if (event.key !== 'Delete') return

    deleteObjects()
  })
}

/**
 * Sets a listener for moving objects using keyboard arrow keys.
 * @param canvas - The Fabric.js canvas object to add listner to.
 * @param moveStep- The amount of pixels to move the object by on each
 * arrow key press (default: 1)
 */

export function setMoveObjectsListener(canvas: fabric.Canvas, moveStep = 1) {
  document.addEventListener('keydown', event => {
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

/**
 * Sets up copy and paste event listeners for a Fabric.js canvas.
 *
 * (CTRL + C / CTRL + V)
 * @param canvas - The Fabric.js canvas instance to attach the listeners to.
 */

export function setCopyPasteListeners(canvas: fabric.Canvas) {
  const { copyObjectToClipboard, pasteObjectFromClipboard } =
    useCanvasOperations(canvas)

  document.addEventListener('keydown', event => {
    if (event.key !== KEYBOARD_KEYS.c || (!event.metaKey && !event.ctrlKey))
      return

    copyObjectToClipboard()
  })

  document.addEventListener('keydown', event => {
    if (event.key !== KEYBOARD_KEYS.v || (!event.metaKey && !event.ctrlKey))
      return

    pasteObjectFromClipboard()
  })
}

/**
 * Sets up a listener for keyboard events that enables undo/redo functionality
 * using the History class.
 *
 * (CTRL + Z / CTRL + SHIFT + Z)
 * @param canvas - The canvas object to attach the listener to.
 */

export function setHistoryNavigationListener(canvas: fabric.Canvas) {
  const history = new History(canvas)

  document.addEventListener('keydown', event => {
    if (
      event.key.toLowerCase() !== KEYBOARD_KEYS.z ||
      (!event.metaKey && !event.ctrlKey)
    )
      return

    if (!event.shiftKey) {
      history.undo()
      return
    }

    history.redo()
  })
}
