import { countTotalReactions } from "../pageInsights"
import values from "./reactionsTotal.json"

const _ = console.log
;(async () => {
  const TEST_CASE = "Count Reaction Total"
  let pass = true

  try {
    const reactions = countTotalReactions(values)
    _("[reactions]", reactions)

    const expectedTotal = 47
    pass = pass && expectedTotal === reactions
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
