import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _resolve from '../src/resolve.mjs'

delete Promise.resolve
_resolve()

test('resolve works', async t => {
  const value = {}
  const p = Promise.resolve(value)
  assert.is(await p, value)
})

test.run()
