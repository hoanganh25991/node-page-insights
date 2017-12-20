import { transformGenderAgesData } from "../pageInsights"
import values from "./genderAges.json"
const _ = console.log
;(async () => {
  const TEST_CASE = "Transform gender ages"
  let pass = true

  try {
    const gender_ages = transformGenderAgesData(values)
    _("[gender_ages]", gender_ages)

    const expectF13_17 = 8
    const expectM55_64 = 32

    const F13_17 = gender_ages.filter(group => group.name === "13-17")[0].F
    const M55_65 = gender_ages.filter(group => group.name === "55-64")[0].M

    _("[F13_17]", F13_17)
    _("[M55_65]", M55_65)

    pass = pass && F13_17 === expectF13_17
    pass = pass && M55_65 === expectM55_64
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
