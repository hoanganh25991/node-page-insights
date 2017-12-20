import { transformGenderAgesData } from "../pageInsights"
import values from "./genderAges.json"
const _ = console.log
;(async () => {
  const TEST_CASE = "Transform gender ages"
  let pass = true

  try {
    const gender_ages = transformGenderAgesData(values)
    _(values)
    _("[gender_ages]", gender_ages)

    const expectF13_17 = 16
    pass = gender_ages.filter(group => (group.name = "13-17"))[0].F === expectF13_17
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
