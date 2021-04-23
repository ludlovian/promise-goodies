import test from 'ava'

import _finally from '../src/finally.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.finally
_finally()
_delay()

test('finally on resolved', async t => {
  const v = {}
  let called
  const p = Promise.resolve(v)
    .delay(10)
    .finally(function (v) {
      t.is(v, undefined)
      t.is(this, undefined)
      called = true
    })
  t.is(await p, v)
  t.true(called)
})

test('finally on rejected', async t => {
  const e = new Error()
  let called
  const p = Promise.reject(e)
    .delay(10)
    .finally(function (v) {
      t.is(v, undefined)
      t.is(this, undefined)
      called = true
    })
  await t.throwsAsync(p, { is: e })
  t.true(called)
})

test('finally that throws', async t => {
  const e = new Error()
  const e2 = new Error()
  const p = Promise.reject(e)
    .delay(10)
    .finally(() => {
      throw e2
    })
  await t.throwsAsync(p, { is: e2 })
})
