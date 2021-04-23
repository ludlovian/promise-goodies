import { polyfill } from './util.mjs'

export default function (P = Promise) {
  polyfill(P, {
    all (iterable) {
      const P = this
      return new P((resolve, reject) => {
        const result = []
        let n = 0
        for (const el of iterable) resolveItem(el, n++)
        if (!n) resolve(result)

        function resolveItem (el, i) {
          P.resolve(el).then(value => {
            result[i] = value
            if (!--n) resolve(result)
          }, reject)
        }
      })
    }
  })
}
