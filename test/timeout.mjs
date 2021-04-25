import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _timeout from '../src/timeout.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.timeout
_timeout()
_delay()

test('promise that does not timeout', async () => {
  const v = {}
  const p = Promise.resolve(v)
    .delay(10)
    .timeout(20)
  assert.is(await p, v)
})

test('promise that times out', async () => {
  const v = {}
  const p = Promise.resolve(v)
    .delay(20)
    .timeout(10)
  await p.then(assert.unreachable, err => {
    assert.instance(err, Error)
    assert.is(err.message, 'Timed out')
  })
})

test('custom timeout error', async () => {
  class TE extends Error {}
  const p = Promise.resolve()
    .delay(20)
    .timeout(10, TE)
  await p.then(assert.unreachable, err => assert.instance(err, TE))
})

test('timeout rejected promise', async () => {
  const e = new Error()
  const p = Promise.reject(e)
    .delay(10)
    .timeout(20)
  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
