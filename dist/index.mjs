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

function all (P = Promise) {
  polyfill(P, {
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
    }
  });
}

function catchif (P = Promise) {
  polyfill(P.prototype, {
    catchif (predicate, fn) {
      return this.catch(error => {
        if (errorMatches(predicate, error)) return fn(error)
        throw error
      })
    }
  });
}

function deferred (P = Promise) {
  polyfill(P, {
    deferred () {
      let resolve;
      let reject;
      const p = new this((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
      return Object.assign(p, { resolve, reject })
    }
  });
}

function delay (P = Promise) {
  polyfill(P.prototype, {
    delay (ms) {
      return this.then(
        value => new P(resolve => setTimeout(() => resolve(value), ms))
      )
    }
  });
  polyfill(P, {
    delay (ms, value) {
      return this.resolve(value).delay(ms)
    }
  });
}

function finally_ (P = Promise) {
  polyfill(P.prototype, {
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
    }
  });
}

function isResolved (P = Promise) {
  polyfill(P.prototype, {
    isResolved (ms = 10) {
      const that = this;
      return new P((resolve, reject) => {
        setTimeout(() => resolve(false), ms);
        that.then(() => resolve(true), reject);
      })
    }
  });
}

function map (P = Promise) {
  polyfill(P.prototype, {
    map (fn, { concurrency = Infinity } = {}) {
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
    }
  });
  polyfill(P, {
    map (iterable, fn, opts) {
      return P.resolve(iterable).map(fn, opts)
    }
  });
}

function race (P = Promise) {
  polyfill(P, {
    race (iterable) {
      return new P((resolve, reject) => {
        for (const el of iterable) {
          this.resolve(el).then(resolve, reject);
        }
      })
    }
  });
}

function reject (P = Promise) {
  polyfill(P, {
    reject (reason) {
      return new P((resolve, reject) => reject(reason))
    }
  });
}

function resolve (P = Promise) {
  polyfill(P, {
    resolve (value) {
      return new P(resolve => resolve(value))
    }
  });
}

function timeout (P = Promise) {
  polyfill(P.prototype, {
    timeout (ms, TimeoutError = Error) {
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
    }
  });
}

function promiseGoodies (P = Promise) {
  if (typeof P !== 'function') return
  all(P);
  catchif(P);
  deferred(P);
  delay(P);
  finally_(P);
  isResolved(P);
  map(P);
  race(P);
  reject(P);
  resolve(P);
  timeout(P);
}

export default promiseGoodies;
