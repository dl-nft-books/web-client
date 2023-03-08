import { Buffer } from 'buffer'

/**
 * Converts a data URI to a Blob object.
 *
 * @param {string} dataURI - The data URI to be converted to a Blob.
 * @param {string} mimeType - The MIME type of the file being converted.
 *
 * @returns {Blob} A Blob object representing the file.
 */

export function dataUriToBlob(dataURI: string, mimeType: string) {
  const arrayBuffer = Buffer.from(dataURI, 'base64')

  return new Blob([new Uint8Array(arrayBuffer)], {
    type: mimeType,
  })
}
