import { pageImpressions} from "../pageInsights";

const _ = console.log

  /* Quick test area */
;(async () => {
  const TEST_CASE = "Get page impressions"
  let pass = true

  try {
    // const {
    //   pageId:
    // }
    const query = {pageId,pageToken}
    const {impressions} = await pageImpressions(query)
    _("[impressions]", impressions)
    if(!impressions) return pass = false

  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
