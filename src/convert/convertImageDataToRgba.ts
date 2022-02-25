import { logError } from '../log'

/**
 * RGBA color representation
 */
export interface RgbaColor {
  /**
   * Red channel (0-255)
   */
  r: number
  /**
   * Green channel (0-255)
   */
  g: number
  /**
   * Blue channel (0-255)
   */
  b: number
  /**
   * Alpha channel (0-255)
   */
  a: number
}

/**
 * Converts the image data array into an RGB color array representation.
 *
 * @param imageData data property of {@link ImageData} or an array of numbers with the same shape.
 *
 * @example
 * const ctx = canvas.getContext('2d')
 * const imageData = ctx.getImageData(0, 0, 640, 480)
 *
 * const colors = convertImageDataToRgba(imageData.data)
 *
 */
const convertImageDataToRgba = (imageData: number[]): RgbaColor[] => {
  if (imageData.length % 4 !== 0) {
    logError('color mage: invalid imageData provided!')
    return []
  }

  const colors = []
  for (let i = 0; i < imageData.length; i += 4) {
    colors.push({ r: imageData[i], g: imageData[i + 1], b: imageData[i + 2], a: imageData[i + 3] })
  }

  return colors
}

export default convertImageDataToRgba
