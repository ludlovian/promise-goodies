import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _isResolved from '../src/is-resolved.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.isResolved
_isResolved()
_delay()

test('on pending promise', async () => {
  const p = Promise.resolve().delay(50)
  assert.not.ok(await p.isResolved())
  await p
})

test('on resolved promise', async () => {
  const p = Promise.resolve()
  assert.ok(await p.isResolved())
})

test('with custom time', async () => {
  const p = Promise.resolve().delay(20)
  assert.ok(await p.isResolved(30))
})

test('on rejected', async () => {
  const e = new Error()
  const p = Promise.reject(e)
  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
