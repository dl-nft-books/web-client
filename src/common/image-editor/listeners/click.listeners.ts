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
    if (event.e.button !== MOUSE_BUTTONS.right) return

    const pointer = canvas.getPointer(event.e)
    const target = canvas
      .getObjects()
      .find(object =>
        object.containsPoint(new fabric.Point(pointer.x, pointer.y)),
      )

    if (!target) return

    canvas.setActiveObject(target)

    contextMenuState.value = !contextMenuState.value
  })
}
