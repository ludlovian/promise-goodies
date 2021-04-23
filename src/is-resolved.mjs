import { polyfill } from './util'

export default function (P = Promise) {
  polyfill(P.prototype, {
    isResolved (ms = 10) {
      const that = this
      return new P((resolve, reject) => {
        setTimeout(() => resolve(false), ms)
        that.then(() => resolve(true), reject)
      })
    }
  })
}
