import { polyfill } from './util.mjs'

export default function (P = Promise) {
  polyfill(P, {
    reject (reason) {
      return new P((resolve, reject) => reject(reason))
    }
  })
}
