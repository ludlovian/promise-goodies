import test from 'ava'

import _delay from '../src/delay'

delete Promise.delay
delete Promise.prototype.delay
_delay()

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

test('class delay', async t => {
  let resolved = false
  Promise.delay(30).then(() => {
    resolved = true
  })

  await wait(10)
  t.false(resolved)

  await wait(40)
  t.true(resolved)
})

test('instance delay', async t => {
  let resolved = false
  Promise.resolve({})
    .delay(30)
    .then(() => {
      resolved = true
    })

  await wait(10)
  t.false(resolved)

  await wait(40)
  t.true(resolved)
})

test('rejected does not delay', async t => {
  let rejected = false
  const e = new Error()
  const p = Promise.reject(e)
    .delay(30)
    .finally(() => {
      rejected = true
    })

  await wait(10)
  t.true(rejected)

  await t.throwsAsync(p, { is: e })
})
