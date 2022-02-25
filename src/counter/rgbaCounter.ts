import { RgbaColor, RgbaCounter } from '../types'

/**
 * Counts the number of occurrences of each color
 *
 * @param colors the colors that will be counted
 * @param withAlpha whether consider or not the alpha channel while counting
 */
const rgbaCounter = (colors: RgbaColor[], withAlpha = true): RgbaCounter[] => {
  const colorIndex = colors.reduce((acc, curr) => {
    const key = getColorKey(curr, withAlpha)
    acc[key] ??= { color: curr, count: 0 }
    acc[key].count++

    return acc
  }, {} as Record<string, RgbaCounter>)

  return Object.values(colorIndex)
}

export default rgbaCounter

const getColorKey = (color: RgbaColor, withAlpha: boolean) => {
  const baseKey = `${color.r}-${color.g}-${color.b}`
  return withAlpha ? `${baseKey}-${color.a}` : baseKey
}
