import test from 'ava'

import _all from '../src/all'
import _delay from '../src/delay'

delete Promise.all
_all()
_delay()

test('all on array', async t => {
  const p = Promise.all([
    Promise.delay(30, 11),
    Promise.delay(10, 22),
    Promise.delay(20, 33)
  ])
  t.deepEqual(await p, [11, 22, 33])
})

test('all on empty array', async t => {
  const p = Promise.all([])
  t.deepEqual(await p, [])
})

test('all which rejects', async t => {
  const e = new Error()
  const p = Promise.all([
    Promise.delay(10, 11),
    Promise.delay(30).then(() => {
      throw e
    }),
    Promise.delay(20, 33)
  ])
  await t.throwsAsync(p, { is: e })
})
