import { sequelize } from "./connection"
import { getAllCamps, getCamp, checkElg, getEntry, getPrize } from "./index"

const _ = console.log

/* Quick test area */
;(async () => {
  const TEST_CASE = "Test read db"
  let pass = true

  try {
    // /* Fetch all campaigns */
    // const campaigns = await getAllCamps()
    // campaigns.forEach(c => _(c.title))
    //
    //
    // /* Find campaign based on code */
    // const campaign = await getCamp("XXMAS")
    // const campaign2 = await getCamp("XMAS")
    //
    // _(campaign && campaign.title)
    // _(campaign2 && campaign2.title)
    //
    //
    //
    //
    // _(prizes && prizes.length)
    // _(prize2s && prize2s.length)
    // if (prize2s) {
    //   prize2s.forEach(pages => _(`Prize name: ${pages.name}`))
    // }
    // /* Check eligibility */
    // const e = await checkElg({code: "XMAS", email: "hoanganh25991@gmail.com"})
    // const e2 = await checkElg({code: "XMAS", email: "lehoanganh25991@gmail.com"})
    // _(e, e2)

    // /* Get entry */
    // const entry = await getEntry(1)
    // console.log("[entry.prize_id]", entry && entry.prize_id)

    /* Get prize */
    const prize = await getPrize(1)
    console.log("[prize.winning_instruction]", prize && prize.winning_instruction)
  } catch (err) {
    _(err)
    pass = false
  } finally {
    await sequelize.close()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
