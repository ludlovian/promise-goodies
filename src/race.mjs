import { polyfill } from './util'

export default function (P = Promise) {
  polyfill(P, {
    race (iterable) {
      return new P((resolve, reject) => {
        for (const el of iterable) {
          this.resolve(el).then(resolve, reject)
        }
      })
    }
  })
}
