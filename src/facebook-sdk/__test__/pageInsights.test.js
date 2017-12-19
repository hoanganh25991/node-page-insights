import {getPageAccessTokens, pageImpressions, pageEngagedUsers} from "../pageInsights";
import dotenv from "dotenv"

dotenv.config()
const {USER_ACCESS_TOKEN: userAccessToken} = process.env
const _ = console.log

;(async () => {
  const TEST_CASE = "Get page impressions"
  let pass = true

  try {
    const {pageAccessTokens} = await getPageAccessTokens(userAccessToken)
    const firstPage = pageAccessTokens.data[0]

    // Query condition
    const {id: pageId, access_token: pageToken} = firstPage
    const query = {pageId,pageToken}

    // Read impressions
    const {impressions} = await pageImpressions(query)
    _("[impressions]", impressions)
    if(!impressions) return pass = false

    // Read engagements
    const {engagements} = await pageEngagedUsers(query)
    _("[engagements]", engagements)
    if(!engagements) return pass = false

  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
