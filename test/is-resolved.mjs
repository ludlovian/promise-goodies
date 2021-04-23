import test from 'ava'

import _isResolved from '../src/is-resolved.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.isResolved
_isResolved()
_delay()

test('on pending promise', async t => {
  const p = Promise.resolve().delay(50)
  t.false(await p.isResolved())
  await p
})

test('on resolved promise', async t => {
  const p = Promise.resolve()
  t.true(await p.isResolved())
})

test('with custom time', async t => {
  const p = Promise.resolve().delay(20)
  t.true(await p.isResolved(30))
})

test('on rejected', async t => {
  const e = new Error()
  const p = Promise.reject(e)
  await t.throwsAsync(() => p.isResolved(), { is: e })
})