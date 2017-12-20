import { extractDataFromGraphRes } from "../pageInsights"
import dataRes from "./graphApiDataRes.json"
import dataRes2 from "./graphApiDataRes2.json"

const _ = console.log
;(async () => {
  const TEST_CASE = "Extract First Data"
  let pass = true

  try {
    // Test case 1
    const fakeRes = { data: dataRes }
    const values = await extractDataFromGraphRes(fakeRes)
    _("[values]", values)
    pass = pass && (values.length > 0 && values[0].value === 10)

    // Test case 2
    const fakeRes2 = { data: dataRes2 }
    try {
      const values2 = await extractDataFromGraphRes(fakeRes2)
      _("[values2]", values2)
      pass = pass && false
    } catch (err) {
      _("[err.message]", err.message)
      const expectedErrMsg = "[ERR] Fetch facebook graph api"
      pass = pass && err.message === expectedErrMsg
    }
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
