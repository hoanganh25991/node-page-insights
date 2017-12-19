import { _cleanUp } from "./index"

const _ = console.log

_("")
;(async () => {
  const TEST_CASE = "Clean up"
  let pass = true

  try {
    await _cleanUp()
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
