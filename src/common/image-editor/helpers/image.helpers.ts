/**
 * Calculates the scale factor needed to fit an image within a container while
 * preserving aspect ratio.
 * @param {number} imageWidth - Width of the image.
 * @param {number} imageHeight - Height of the image.
 * @param {number} containerWidth - Width of the container.
 * @param {number} containerHeight - Height of the container.
 *
 * @returns {number} - The scale factor needed to fit the image within
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
