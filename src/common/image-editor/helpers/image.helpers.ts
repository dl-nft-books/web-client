import { fabric } from 'fabric'

export function getImageScaleFactor(
  imageWidth: number,
  imageHeight: number,
  canvasInstance: fabric.Canvas,
) {
  if (!canvasInstance.width || !canvasInstance.height) return

  const imageAspectRatio = imageWidth / imageHeight
  const canvasAspectRatio = canvasInstance.width / canvasInstance.height

  let scaleFactor = canvasInstance.height / imageHeight

  if (imageAspectRatio > canvasAspectRatio) {
    scaleFactor = canvasInstance.width / imageWidth
  }

  return scaleFactor
}
