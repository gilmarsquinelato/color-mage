import { RgbaColor } from '../types'
import convertRgbToHex from './convertRgbToHex'

describe('convert', () => {
  it.each([
    [{ r: 0, g: 0, b: 0, a: 0 }, '#000000'],
    [{ r: 255, g: 0, b: 0, a: 0 }, '#FF0000'],
    [{ r: 0, g: 255, b: 0, a: 0 }, '#00FF00'],
    [{ r: 0, g: 0, b: 255, a: 0 }, '#0000FF'],
    [{ r: 255, g: 255, b: 255, a: 0 }, '#FFFFFF'],
    [{ r: 128, g: 128, b: 128, a: 0 }, '#808080']
  ] as [RgbaColor, string][])('Should convert %j to %s', (color, hexColor) => {
    const result = convertRgbToHex(color)
    expect(result).toBe(hexColor)
  })
})
