import { RgbaColor } from '../types'
import rgbaCounter from './rgbaCounter'

describe('counter/rgbaCounter', () => {
  it('should count all colors considering the alpha channel', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 255 },
      { r: 0, g: 0, b: 0, a: 128 }
    ]

    const count = rgbaCounter(colors)

    expect(count).toEqual([
      { color: { r: 0, g: 0, b: 0, a: 0 }, count: 2 },
      { color: { r: 0, g: 0, b: 0, a: 255 }, count: 1 },
      { color: { r: 0, g: 0, b: 0, a: 128 }, count: 1 }
    ])
  })

  it('should count all colors not considering the alpha channel', () => {
    const colors: RgbaColor[] = [
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 0, g: 0, b: 0, a: 255 },
      { r: 0, g: 0, b: 0, a: 128 }
    ]

    const count = rgbaCounter(colors, false)

    expect(count).toEqual([
      { color: { r: 0, g: 0, b: 0, a: 0 }, count: 4 }
    ])
  })
})
