import convertImageDataToRgba from './convertImageDataToRgba'
import { logError } from '../log'

jest.mock('../log')
const logErrorMock = logError as jest.MockedFunction<typeof logError>

describe('convert/convertImageDataToRgba', () => {
  it('should convert all pixels', () => {
    const imageData = [0, 0, 0, 0, 255, 255, 255, 255]
    const colors = convertImageDataToRgba(imageData)

    expect(colors).toEqual([
      { r: 0, g: 0, b: 0, a: 0 },
      { r: 255, g: 255, b: 255, a: 255 }
    ])
  })

  it('should log error with invalid shape', () => {
    const colors = convertImageDataToRgba([0, 0, 0, 255, 255, 255])

    expect(colors).toHaveLength(0)
    expect(logErrorMock).toHaveBeenCalledTimes(1)
  })
})
