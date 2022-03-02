import rgbaCounter from '../counter/rgbaCounter'
import { RgbaColor } from '../types'

/**
 * Additional options for K-Means color extractor
 */
export interface KMeansColorExtractorOptions {
  /**
   * Maximum number of loops the algorithm can perform (default 10).
   * This number can be increased to have more accurate colors,
   * but depending on the range of colors being it might take longer to finish.
   *
   * If the algorithm finishes its calculation before reaching the end,
   * it will immediately return the colors found.
   */
  maxRuns: number
  /**
   * Whether consider the alpha channel while finding the colors (default false).
   */
  withAlpha: boolean
  /**
   * Use random parts of the array as the initial values or offset based (default false).
   */
  randomSeed: boolean
  /**
   * After extracting the colors,
   * should it return the nearest colors of each group or the median color of each group? (default true)
   *
   * With this option enabled it will return only colors that are part of color set.
   * This option is useful if colors from a logo are being extracted,
   * so only colors that are part of the logo will be returned.
   */
  nearestColors: boolean
}

const defaultOptions: KMeansColorExtractorOptions = {
  maxRuns: 10,
  withAlpha: false,
  randomSeed: false,
  nearestColors: true
}

/**
 * Extracts colors using the K-Means algorithm.
 * With that approach the colors can be found by finding the mean color on each group.
 * Where the colors are grouped based on their RGB distance.
 *
 * @param colors the list of all colors to be considered
 * @param count the number of colors to be extracted
 * @param options additional options {@see KMeansColorExtractorOptions} for more details
 */
const kMeansColorExtractor = (
  colors: RgbaColor[],
  count: number,
  options?: Partial<KMeansColorExtractorOptions>
): RgbaColor[] => {
  const mergedOptions = { ...defaultOptions, ...options }
  const { withAlpha, nearestColors } = mergedOptions

  const uniqueColors = rgbaCounter(colors, withAlpha)
    .sort((a, b) => b.count - a.count)
    .map((it) => it.color)

  if (uniqueColors.length <= count) return uniqueColors

  const foundColors = runKMeans(uniqueColors, count, mergedOptions)
  if (!nearestColors) return foundColors

  return foundColors.map((color) => getNearestColor(uniqueColors, color, withAlpha))
}

export default kMeansColorExtractor

const runKMeans = (colors: RgbaColor[], count: number, options: KMeansColorExtractorOptions) => {
  const { maxRuns, withAlpha, randomSeed } = options

  let centroids = getInitialCentroids(colors, count, randomSeed)
  let clustering = getIndexedColors(colors, centroids, withAlpha)

  for (let i = 0; i < maxRuns; i++) {
    const newCentroids = recomputeCentroids(colors, clustering, count)
    const newClustering = getIndexedColors(colors, newCentroids, withAlpha)

    if (isEqualArray(clustering, newClustering)) {
      return newCentroids
    } else {
      clustering = newClustering
      centroids = newCentroids
    }
  }

  return centroids
}

/**
 * Creates an initial centroid list
 *
 * @param colors
 * @param count
 * @param randomSeed
 */
const getInitialCentroids = (colors: RgbaColor[], count: number, randomSeed: boolean) => {
  const emptyArray = new Array(count).fill(null)
  if (randomSeed) {
    const randomIndex = () => Math.floor(Math.random() * colors.length)
    return emptyArray.map(() => colors[randomIndex()])
  }

  const chunkSize = Math.floor(colors.length / count)
  return emptyArray.map((_, index) => colors[index * chunkSize])
}

/**
 * Index the colors based on the centroids.
 * Each color will be assigned to the centroid index that is closest to that color.
 *
 * @param colors
 * @param centroids
 * @param withAlpha
 */
const getIndexedColors = (colors: RgbaColor[], centroids: RgbaColor[], withAlpha: boolean) => {
  return colors.map((color) => getNearestColorIndex(centroids, color, withAlpha))
}

/**
 * Recalculate the median position/color for each centroid based on the assigned colors for each centroid.
 *
 * @param colors
 * @param clustering
 * @param count
 */
const recomputeCentroids = (colors: RgbaColor[], clustering: number[], count: number) => {
  const centroids = new Array(count)
    .fill(null)
    .map(() => ({ sum: { r: 0, g: 0, b: 0, a: 0 }, count: 0 }))

  colors.forEach((color, index) => {
    const cluster = clustering[index]

    centroids[cluster].count++

    centroids[cluster].sum.r += color.r
    centroids[cluster].sum.g += color.g
    centroids[cluster].sum.b += color.b
    centroids[cluster].sum.a += color.a
  })

  return centroids.map(({ sum, count }) => ({
    r: sum.r / count,
    g: sum.g / count,
    b: sum.b / count,
    a: sum.a / count
  } as RgbaColor))
}

const getNearestColorIndex = (colors: RgbaColor[], color: RgbaColor, withAlpha: boolean): number => {
  const { index } = colors
    .reduce(
      (acc, item, index) => {
        const distance = getColorDistance(color, item, withAlpha)
        return distance < acc.distance
          ? { index, distance }
          : { ...acc }
      },
      { index: Infinity, distance: Infinity }
    )
  return index
}

const getNearestColor = (colors: RgbaColor[], color: RgbaColor, withAlpha: boolean): RgbaColor => {
  const index = getNearestColorIndex(colors, color, withAlpha)
  return colors[index]
}

/**
 * Calculates the Euclidean distance between two colors.
 *
 * @param a
 * @param b
 * @param withAlpha
 */
const getColorDistance = (a: RgbaColor, b: RgbaColor, withAlpha?: boolean): number => {
  const distance =
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)

  if (withAlpha) return distance + Math.pow(a.a - b.a, 2)
  return distance
}

const isEqualArray = (a: number[], b: number[]) =>
  !!a.find((it, index) => it === b[index])
