import { removeLeakedToken } from "./index"

const _ = console.log

_("")
;(async () => {
  const TEST_CASE = "Remove leaked token"
  let pass = true

  try {
    const code = "XMAS"
    const email = "lehoanganh25991@gmail.com"
    const timeRange = [1512616168, 1512616668]
    await removeLeakedToken({ code, email, timeRange })
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
