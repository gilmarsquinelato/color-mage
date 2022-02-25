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
 * Represents the amount of times that a color was found
 */
export interface RgbaCounter {
  /**
   * RGBA color
   */
  color: RgbaColor
  /**
   * Number of occurrences
   */
  count: number
}
