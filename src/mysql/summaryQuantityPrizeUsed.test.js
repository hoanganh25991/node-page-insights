import { sequelize } from "./connection"
import { getEntryWithCountPrize, getSummaryPrizeQuantityUsed } from "./index"

const _ = console.log

/* Quick test area */
;(async () => {
  const TEST_CASE = "Test summary quantity prize"
  let pass = true

  try {
    // const entries = await getEntryWithCountPrize()
    // entries.map(entry => {
    //   const {prize_id} = entry
    //   const q = entry.get("quantity_used")
    //   console.log(q)
    // })
    const { summary } = await getSummaryPrizeQuantityUsed()
    console.log(summary)
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await sequelize.close()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
