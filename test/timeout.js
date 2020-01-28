import test from 'ava'

import promiseGoodies from '../src'

delete Promise.prototype.timeout
promiseGoodies()

test('promise that does not timeout', async t => {
  const v = {}
  const p = Promise.resolve(v)
    .delay(10)
    .timeout(20)
  t.is(await p, v)
})

test('promise that times out', async t => {
  const v = {}
  const p = Promise.resolve(v)
    .delay(20)
    .timeout(10)
  await t.throwsAsync(p, { instanceOf: Error, message: 'Timed out' })
})

test('custom timeout error', async t => {
  class TE extends Error {}
  const p = Promise.resolve()
    .delay(20)
    .timeout(10, TE)
  await t.throwsAsync(p, { instanceOf: TE })
})

test('timeout rejected promise', async t => {
  const e = new Error()
  const p = Promise.reject(e)
    .delay(10)
    .timeout(20)
  await t.throwsAsync(p, { is: e })
})
