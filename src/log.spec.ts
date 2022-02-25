import { isProduction } from './env'
import { logError } from './log'

jest.mock('./env')
const isProductionMock = isProduction as jest.MockedFunction<typeof isProduction>

describe('log', () => {
  it('should log error when not in production', () => {
    const consoleError = jest.spyOn(console, 'error')

    logError('ok')

    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalledWith('ok')
  })

  it('should not log error when in production', () => {
    const consoleError = jest.spyOn(console, 'error')
    isProductionMock.mockReturnValue(true)

    logError('ok')

    expect(consoleError).not.toHaveBeenCalled()
  })
})
