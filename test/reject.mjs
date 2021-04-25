import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _reject from '../src/reject.mjs'

delete Promise.reject
_reject()

test('reject throws', async () => {
  const e = new Error()
  const p = Promise.reject(e)
  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
