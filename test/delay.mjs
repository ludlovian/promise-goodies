import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _delay from '../src/delay.mjs'

delete Promise.delay
delete Promise.prototype.delay
_delay()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

test('class delay', async () => {
  let resolved = false
  Promise.delay(30).then(() => {
    resolved = true
  })

  await wait(10)
  assert.not.ok(resolved)

  await wait(40)
  assert.ok(resolved)
})

test('instance delay', async () => {
  let resolved = false
  Promise.resolve({})
    .delay(30)
    .then(() => {
      resolved = true
    })

  await wait(10)
  assert.not.ok(resolved)

  await wait(40)
  assert.ok(resolved)
})

test('rejected does not delay', async () => {
  let rejected = false
  const e = new Error('Oops')
  const start = Date.now()
  await Promise.reject(e)
    .delay(30)
    .finally(() => {
      rejected = true
    })
    .then(assert.unreachable, err => assert.is(err, e))

  const end = Date.now()
  assert.ok(end - start < 30)
  assert.ok(rejected)
})

test.run()
