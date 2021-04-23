import { polyfill } from './util.mjs'

export default function (P = Promise) {
  polyfill(P.prototype, {
    timeout (ms, TimeoutError = Error) {
      const that = this
      return new P((resolve, reject) => {
        let tm = setTimeout(() => {
          tm = undefined
          reject(new TimeoutError('Timed out'))
        }, ms)
        that.then(value => {
          // istanbul ignore else
          if (tm) {
            clearTimeout(tm)
            tm = undefined
            resolve(value)
          }
        }, reject)
      })
    }
  })
}
