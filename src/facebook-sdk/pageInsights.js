import dotenv from "dotenv"
import OAxois from "axios"

dotenv.config()
const {FACEBOOK_GRAPH_API_ENDPOINT: endpoint} = process.env
const axios = OAxois.create({timeout: 4000})
const _ = console.log

const metricReactions = ["page_actions_post_reactions_like_total", "page_actions_post_reactions_love_total", "page_actions_post_reactions_wow_total", "page_actions_post_reactions_haha_total", "page_actions_post_reactions_sorry_total", "page_actions_post_reactions_anger_total", "page_actions_post_reactions_total"]


export const getPageAccessTokens = async userAccessToken => {
  const res = await axios.get(`${endpoint}/me/accounts`, {
    params: {access_token: userAccessToken}
  })

  const {data: pageAccessTokens} = res
  return {pageAccessTokens}
}

export const callMetric = async ({pageId, access_token, date_preset, period, metric}) => {
  return await axios.get(`${endpoint}/${pageId}/insights`, {
    params: {
      metric,
      period,
      access_token,
      date_preset,
    }
  })
}


export const pageImpressions = async ({pageId, pageToken: access_token, date_preset = "this_month", period = "day", metric = "page_impressions"}) => {
  const res = await callMetric({pageId, access_token, date_preset, period, metric})

  const {data: impressions} = res

  return {impressions}
}


export const pageEngagedUsers = async ({pageId, pageToken: access_token, date_preset = "this_month", period = "day", metric = "page_engaged_users"}) => {
  const res = await callMetric({pageId, access_token, date_preset, period, metric})
  const {data: engagements} = res
  return {engagements}
}


export const pagePostEngagements = async ({pageId, pageToken: access_token, date_preset = "this_month", period = "day", metric = "page_post_engagements"}) => {
  const res = await callMetric({pageId, access_token, date_preset, period, metric})
  const {data: post_engagements} = res
  return {post_engagements}
}


export const pageReactions = async ({pageId, pageToken: access_token, date_preset = "this_month", period = "day", metric = "page_actions_post_reactions_total"}) => {
  // const promiseArr = metricReactions.map(async metricName => {
  //   _("[metricName]", metricName)
  //   const res = await callMetric({pageId, access_token, date_preset, period, metricName})
  //   return res.data
  // })
  //
  // const reactions = await Promise.all(promiseArr)
  // return {reactions}
  const res = await callMetric({pageId, access_token, date_preset, period, metric})
  const {data: reactions} = res
  return {reactions}
}