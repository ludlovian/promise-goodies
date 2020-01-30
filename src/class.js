export default {
  resolve (value) {
    return new this(resolve => resolve(value))
  },

  reject (reason) {
    return new this((resolve, reject) => reject(reason))
  },

  race (iterable) {
    return new this((resolve, reject) => {
      for (const el of iterable) {
        this.resolve(el).then(resolve, reject)
      }
    })
  },

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
  },

  map (iterable, fn, opts) {
    return this.resolve(iterable).map(fn, opts)
  },

  delay (ms, value) {
    return this.resolve(value).delay(ms)
  },

  deferred () {
    let resolve
    let reject
    const p = new this((_resolve, _reject) => {
      resolve = _resolve
      reject = _reject
    })
    return Object.assign(p, { resolve, reject })
  }
}
