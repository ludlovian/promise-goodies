'use strict';

function polyfill (target, source) {
  for (const key of Object.keys(source)) {
    if (!(key in target)) target[key] = source[key];
  }
}
function getIterator (iterable) {
  if (Symbol.asyncIterator in iterable) {
    return iterable[Symbol.asyncIterator]()
  }
  if (Symbol.iterator in iterable) {
    return iterable[Symbol.iterator]()
  }
  throw new TypeError('It is not an iterable')
}
function errorMatches (predicate, error) {
  if (typeof predicate === 'function') return error instanceof predicate
  if (
    predicate &&
    typeof predicate === 'object' &&
    error &&
    typeof error === 'object'
  ) {
    for (const [k, v] of Object.entries(predicate)) {
      if (typeof v === 'function') {
        if (!v(error[k])) return false
      } else {
        if (v !== error[k]) return false
      }
    }
    return true
  }
  return false
}

var classPolyfill = {
  resolve (value) {
    return new this(resolve => resolve(value))
  },
  reject (reason) {
    return new this((resolve, reject) => reject(reason))
  },
  race (iterable) {
    return new this((resolve, reject) => {
      for (const el of iterable) {
        this.resolve(el).then(resolve, reject);
      }
    })
  },
  all (iterable) {
    const P = this;
    return new P((resolve, reject) => {
      const result = [];
      let n = 0;
      for (const el of iterable) resolveItem(el, n++);
      if (!n) resolve(result);
      function resolveItem (el, i) {
        P.resolve(el).then(value => {
          result[i] = value;
          if (!--n) resolve(result);
        }, reject);
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
    let resolve;
    let reject;
    const p = new this((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    return Object.assign(p, { resolve, reject })
  }
};

var instancePolyfill = {
  finally (fn) {
    return this.then(
      v => {
        fn();
        return v
      },
      r => {
        fn();
        throw r
      }
    )
  },
  map (fn, { concurrency = Infinity } = {}) {
    const P = this.constructor;
    return this.then(
      iterable =>
        new P((resolve, reject) => {
          const iterator = getIterator(iterable);
          let active = 0;
          let count = 0;
          const result = [];
          let done;
          fetchItem();
          function fetchItem () {
            if (done) return
            const item = iterator.next();
            if (item.then) item.then(startItem, reject);
            else startItem(item);
          }
          function startItem (item) {
            if (item.done) {
              done = true;
              if (!active) resolve(result);
              return
            }
            active++;
            const idx = count++;
            P.resolve(item.value)
              .then(value => fn(value, idx))
              .then(value => {
                result[idx] = value;
                active--;
                fetchItem();
                if (done && !active) resolve(result);
              })
              .catch(reject);
            if (active < concurrency) fetchItem();
          }
        })
    )
  },
  delay (ms) {
    const P = this.constructor;
    return this.then(
      value => new P(resolve => setTimeout(() => resolve(value), ms))
    )
  },
  timeout (ms, TimeoutError = Error) {
    const P = this.constructor;
    const that = this;
    return new P((resolve, reject) => {
      let tm = setTimeout(() => {
        tm = undefined;
        reject(new TimeoutError('Timed out'));
      }, ms);
      that.then(value => {
        if (tm) {
          clearTimeout(tm);
          tm = undefined;
          resolve(value);
        }
      }, reject);
    })
  },
  catchif (predicate, fn) {
    return this.catch(error => {
      if (errorMatches(predicate, error)) return fn(error)
      throw error
    })
  },
  isResolved (ms = 10) {
    const P = this.constructor;
    return P.race([P.delay(ms).then(() => false), this.then(() => true)])
  }
};

function promiseGoodies (P = Promise) {
  if (typeof P !== 'function') return
  polyfill(P, classPolyfill);
  polyfill(P.prototype, instancePolyfill);
}

module.exports = promiseGoodies;
