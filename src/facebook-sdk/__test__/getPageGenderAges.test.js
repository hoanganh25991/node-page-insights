import { getPageAccessTokens, pageGenderAges } from "../pageInsights"
import prompt from "prompt"

const _ = console.log
;(async () => {
  const TEST_CASE = "Get Page Gender Ages"
  let pass = true

  const BUSLEH_PAGE_ID = "1602144450026743"

  try {
    // Ask for dynamic User Access Token
    prompt.start()
    const userAccessToken = await new Promise(rslv => {
      prompt.get(["userAccessToken"], (err, { userAccessToken }) => rslv(userAccessToken))
    })
    prompt.stop()

    const { pageAccessTokens } = await getPageAccessTokens(userAccessToken)
    const busLehPage = pageAccessTokens.filter(page => page.id === BUSLEH_PAGE_ID)[0]
    if (!busLehPage) return (pass = false && _("No BusLeh page found to test"))

    const { id: pageId, access_token: pageToken } = busLehPage
    const { gender_ages } = await pageGenderAges({ pageId, pageToken })

    _("[gender_ages]", gender_ages)

    pass = gender_ages
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
