import CancelToken from '../../src/cancel/CancelToken'
import Cancel from '../../src/cancel/Cancel'
import { Canceler } from '../../src/types'

// 这里我们使用了 fail 函数表示一个测试的失败，这个并未在 Jest 文档中体现，但它是一个可以用的 API。
describe('CancelToken', () => {
  describe('reason', () => {
    test('should returns a Cancel if cancellation has been requested', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Operation has been canceled.')
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe('Operation has been canceled.')
    })

    test('should has no side effect if call cancellation for multi times', () => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Operation has been canceled.')
      cancel!('Operation has been canceled.')
      expect(token.reason).toEqual(expect.any(Cancel))
      expect(token.reason!.message).toBe('Operation has been canceled.')
    })

    test('should returns undefined if cancellation has not been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(() => {})
      expect(token.reason).toBeUndefined()
    })
  })
  describe('promise', () => {
    test('should returns Promise that resolves when cancellation is requested', done => {
      let cancel: Canceler
      let token = new CancelToken(c => {
        cancel = c
      })
      token.promise.then(value => {
        expect(value).toEqual(expect.any(Cancel))
        expect(value.message).toBe('Operation has been canceled.')
        done()
      })
      cancel!('Operation has been canceled.')
    })
  })

  describe('throwIfRequest', () => {
    test('should throws if cancellation has been requested', () => {
      let cancel: Canceler
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('Operation has been canceled.')
      try {
        token.throwIfRequested()
        fail('Expected throwIfRequest to throw.')
      } catch (thrown) {
        if (!(thrown instanceof Cancel)) {
          fail('Expected throwIfRequest to throw a Cancel,but test threw' + thrown + '.')
        }
        expect(thrown.message).toBe('Operation has been canceled.')
      }
    })

    test('should does not throw if cancellation has not been requested', () => {
      const token = new CancelToken(c => {})
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('should returns an object containing token and cancel function', () => {
      const source = CancelToken.source()
      expect(source.token).toEqual(expect.any(CancelToken))
      expect(source.cancel).toEqual(expect.any(Function))
      expect(source.token.reason).toBeUndefined()
      source.cancel('Operation has been canceled.')

      expect(source.token.reason).toEqual(expect.any(Cancel))
      expect(source.token.reason!.message).toBe('Operation has been canceled.')
    })
  })
})
