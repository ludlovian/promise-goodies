import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _all from '../src/all.mjs'
import _delay from '../src/delay.mjs'

delete Promise.all
_all()
_delay()

test('all on array', async () => {
  const p = Promise.all([
    Promise.delay(30, 11),
    Promise.delay(10, 22),
    Promise.delay(20, 33)
  ])
  assert.equal(await p, [11, 22, 33])
})

test('all on empty array', async () => {
  const p = Promise.all([])
  assert.equal(await p, [])
})

test('all which rejects', async () => {
  const e = new Error()
  const p = Promise.all([
    Promise.delay(10, 11),
    Promise.delay(30).then(() => {
      throw e
    }),
    Promise.delay(20, 33)
  ])
  await p.then(
    () => {
      assert.unreachable()
    },
    err => {
      assert.is(err, e)
    }
  )
})

test.run()
