import { fabric } from 'fabric'
import { Ref } from 'vue'

enum MOUSE_BUTTONS {
  left,
  middle,
  right,
}

export function setRightClickListener(
  canvas: fabric.Canvas,
  contextMenuState: Ref<boolean>,
) {
  canvas.on('mouse:down', event => {
    if (event.e.button !== MOUSE_BUTTONS.right || !canvas.getActiveObject())
      return

    contextMenuState.value = !contextMenuState.value
  })
}
