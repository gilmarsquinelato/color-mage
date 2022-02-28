import { RgbaColor } from '../types'

/**
 * Converts a {@see RgbaColor} into its hexadecimal representation.
 *
 * @param r
 * @param g
 * @param b
 */
const convertRgbToHex = ({ r, g, b }: RgbaColor) =>
  `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`.toUpperCase()

export default convertRgbToHex

const componentToHex = (c: number) => Math.floor(c).toString(16).padStart(2, '0')
