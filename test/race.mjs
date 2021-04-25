import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _race from '../src/race.mjs'
import _delay from '../src/delay.mjs'

delete Promise.race
_race()
_delay()

test('race where first wins', async t => {
  const p = Promise.race([Promise.delay(10, 11), Promise.delay(20, 22)])
  assert.is(await p, 11)
})

test('race where second wins', async t => {
  const p = Promise.race([Promise.delay(20, 11), Promise.delay(10, 22)])
  assert.is(await p, 22)
})

test('race that throws', async t => {
  const e = new Error()
  const p = Promise.race([
    Promise.delay(20, 11),
    Promise.delay(10).then(() => {
      throw e
    })
  ])

  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
