import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _finally from '../src/finally.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.finally
_finally()
_delay()

test('finally on resolved', async () => {
  const v = {}
  let called
  const p = Promise.resolve(v)
    .delay(10)
    .finally(function (v) {
      assert.is(v, undefined)
      assert.is(this, undefined)
      called = true
    })
  assert.is(await p, v)
  assert.ok(called)
})

test('finally on rejected', async () => {
  const e = new Error()
  let called
  const p = Promise.reject(e)
    .delay(10)
    .finally(function (v) {
      assert.is(v, undefined)
      assert.is(this, undefined)
      called = true
    })

  await p.then(assert.unreachable, err => assert.is(err, e))
  assert.ok(called)
})

test('finally that throws', async () => {
  const e = new Error()
  const e2 = new Error()
  const p = Promise.reject(e)
    .delay(10)
    .finally(() => {
      throw e2
    })
  await p.then(assert.unreachable, err => assert.is(err, e2))
})

test.run()
