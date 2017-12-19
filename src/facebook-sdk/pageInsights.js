import dotenv from "dotenv"
import OAxois from "axios"

dotenv.config()
const {FACEBOOK_GRAPH_API_ENDPOINT: endpoint} = process.env

const axios = OAxois.create({
  timeout: 4000
})


export const getPageAccessTokens = async userAccessToken => {
  const res = await axios.get(`${endpoint}/me/accounts`, {
    params: {access_token: userAccessToken}
  })

  const {data: pageAccessTokens} = res
  return {pageAccessTokens}
}


export const pageImpressions = async ({pageId, pageToken: access_token, date_preset = "this_month", period = "day", metric = "page_impressions"}) => {
  const res = await axios.get(`${endpoint}/${pageId}/insights`, {
    params: {
      access_token,
      metric,
      date_preset,
      period
    }
  })

  const {data: impressions} = res

  return {impressions}
}


