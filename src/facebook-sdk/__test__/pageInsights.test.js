import {
  getPageAccessTokens,
  pageImpressions,
  pageEngagedUsers,
  pagePostEngagements,
  pageReactions
} from "../pageInsights"
import prompt from "prompt"

const _ = console.log
;(async () => {
  const TEST_CASE = "Get page insights"
  let pass = true
  process.env.ENV_TESTING = true

  try {
    // Ask for dynamic User Access Token
    prompt.start()

    const userAccessToken = await new Promise(rslv => {
      prompt.get(["userAccessToken"], (err, { userAccessToken }) => rslv(userAccessToken))
    })

    prompt.stop()

    // Exchange page access token
    // Query condition
    const { pageAccessTokens } = await getPageAccessTokens(userAccessToken)
    const firstPage = pageAccessTokens[0]
    const { id: pageId, access_token: pageToken } = firstPage
    const query = { pageId, pageToken }

    _("[Total][pageAccessTokens]", pageAccessTokens.length)
    _("[query]", query)

    // Read impressions
    // Read engagements
    // Post engagements
    // Reactions
    const { impressions } = await pageImpressions(query)
    const { engagements } = await pageEngagedUsers(query)
    const { post_engagements } = await pagePostEngagements(query)
    const { reactions } = await pageReactions(query)

    _("[impressions]", impressions)
    _("[engagements]", engagements)
    _("[post_engagements]", post_engagements)
    _("[reactions]", reactions)
  } catch (err) {
    _(err.stack.split("\n"))
    _(err.message)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
