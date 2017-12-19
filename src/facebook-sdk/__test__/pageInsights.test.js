import {getPageAccessTokens, pageImpressions, pageEngagedUsers, pagePostEngagements, pageReactions} from "../pageInsights";
import dotenv from "dotenv"

dotenv.config()
const {USER_ACCESS_TOKEN: userAccessToken} = process.env
const _ = console.log

;(async () => {
  const TEST_CASE = "Get page insights"
  let pass = true

  try {
    const {pageAccessTokens} = await getPageAccessTokens(userAccessToken)
    const firstPage = pageAccessTokens.data[0]

    // Query condition
    const {id: pageId, access_token: pageToken} = firstPage
    const query = {pageId,pageToken}

    _("[query]", query)

    // // Read impressions
    // const {impressions} = await pageImpressions(query)
    // _("[impressions]", impressions)
    // if(!impressions) return pass = false
    //
    // // Read engagements
    // const {engagements} = await pageEngagedUsers(query)
    // _("[engagements]", engagements)
    // if(!engagements) return pass = false
    //
    // // Post engagements
    // const {post_engagements} = await pagePostEngagements(query)
    // _("[post_engagements]", post_engagements)
    // if(!post_engagements) return pass = false


    // Reactions
    const {reactions} = await pageReactions(query)
    _("[reactions]", reactions)
    if(!reactions) return pass = false

  } catch (err) {
    _(err.stack.split("\n"))
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
