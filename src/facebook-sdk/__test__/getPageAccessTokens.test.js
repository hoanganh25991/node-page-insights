import {getPageAccessTokens} from "../pageInsights";
import prompt from "prompt"

const _ = console.log

;(async () => {
  const TEST_CASE = "Get page access tokens"
  let pass = true

  try {
    // Ask for dynamic User Access Token
    prompt.start();
    const userAccessToken = await new Promise(rslv => {
      prompt.get(['userAccessToken'], (err, {userAccessToken}) => rslv(userAccessToken))
    })
    prompt.stop()

    const {pageAccessTokens} = await getPageAccessTokens(userAccessToken)
    _("[pageAccessTokens]", pageAccessTokens)
    const shouldHave = pageAccessTokens && pageAccessTokens.length > 0
    if(!shouldHave) return pass = false
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()

