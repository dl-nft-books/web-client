/**
 * Calculates the scale factor needed to fit an image within a container while
 * preserving aspect ratio.
 * @param imageWidth - Width of the image.
 * @param imageHeight - Height of the image.
 * @param containerWidth - Width of the container.
 * @param containerHeight - Height of the container.
 *
 * @returns - The scale factor needed to fit the image within
 * the container.
 */

export function getImageScaleFactor(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
) {
  const widthRatio = containerWidth / imageWidth
  const heightRatio = containerHeight / imageHeight

  return widthRatio < heightRatio ? widthRatio : heightRatio
}
