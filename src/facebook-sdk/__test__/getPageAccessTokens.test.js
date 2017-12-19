import {getPageAccessTokens} from "../pageInsights";
import dotenv from "dotenv"

dotenv.config()
const {USER_ACCESS_TOKEN: userAccessToken} = process.env
const _ = console.log

;(async () => {
  const TEST_CASE = "Get page access tokens"
  let pass = true

  try {
    const {pageAccessTokens} = await getPageAccessTokens(userAccessToken)
    _("[pageAccessTokens]", pageAccessTokens)
    const shouldHave = pageAccessTokens && pageAccessTokens.data.length > 0
    if(!shouldHave) return pass = false
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()

