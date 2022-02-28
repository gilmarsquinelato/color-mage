import { RgbaColor } from '../types'
import kMeansColorExtractor from './kMeansColorExtractor'

describe('kMeansColorExtractor', () => {
  it('should return all colors when it has less than count', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ]

    const extractedColors = kMeansColorExtractor(colors, 5)

    expect(extractedColors).toEqual(colors)
  })

  it('should return unique colors when it has less than count', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ]

    const extractedColors = kMeansColorExtractor(colors, 5)

    expect(extractedColors).toEqual([
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ])
  })

  it('with exact colors', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 }, // this will be discarded since it occurs only once
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ]

    const extractedColors = kMeansColorExtractor(colors, 3)

    expect(extractedColors).toEqual([
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ])
  })

  it('without exact colors', () => {
    const colors: RgbaColor[] = [
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 50, b: 60, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 100, g: 255, b: 128, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 },
      { r: 0, g: 0, b: 255, a: 0 }
    ]

    const extractedColors = kMeansColorExtractor(colors, 3, { nearestColors: false })

    expect(extractedColors).toEqual([
      { r: 0, g: 0, b: 255, a: 0 },
      { r: 255, g: 25, b: 30, a: 0 },
      { r: 50, g: 255, b: 64, a: 0 }
    ])
  })

  it('with alpha', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 255 },
      { r: 0, g: 0, b: 0, a: 255 },
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 0, b: 0, a: 255 },
      { r: 255, g: 0, b: 0, a: 255 },
      { r: 255, g: 0, b: 0, a: 255 },
      { r: 0, g: 255, b: 0, a: 0 }
    ]

    const extractedColors = kMeansColorExtractor(colors, 3, { withAlpha: true })

    expect(extractedColors).toEqual([
      { r: 255, g: 0, b: 0, a: 255 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 255 }
    ])
  })

  it('with random seed', () => {
    const randomMock = jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // first item
      .mockReturnValueOnce(0.4) // second item
      .mockReturnValueOnce(0.6) // third item

    const colors: RgbaColor[] = [
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 50, b: 60, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 50, b: 60, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 },
      { r: 255, g: 255, b: 255, a: 0 } // additional color that will be ignored, just to force the algorithm to run
    ]

    // with maxRuns = 0 we can disable the algorithm and return the initial centroids
    const extractedColors = kMeansColorExtractor(colors, 3, { randomSeed: true, maxRuns: 0 })

    expect(randomMock).toHaveBeenCalledTimes(3)
    expect(extractedColors).toEqual([
      { r: 255, g: 0, b: 0, a: 0 },
      { r: 255, g: 50, b: 60, a: 0 },
      { r: 0, g: 255, b: 0, a: 0 }
    ])
  })
})
