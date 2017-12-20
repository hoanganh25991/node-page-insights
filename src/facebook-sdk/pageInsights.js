import dotenv from "dotenv"
import OAxois from "axios"

dotenv.config()
const { FACEBOOK_GRAPH_API_ENDPOINT: endpoint } = process.env
const _ = console.log

const axios = OAxois.create({
  timeout: 20000,
  validateStatus(status) {
    return status !== 500
  }
})

const metricReactions = [
  "page_actions_post_reactions_like_total",
  "page_actions_post_reactions_love_total",
  "page_actions_post_reactions_wow_total",
  "page_actions_post_reactions_haha_total",
  "page_actions_post_reactions_sorry_total",
  "page_actions_post_reactions_anger_total",
  "page_actions_post_reactions_total"
]

/**
 * Exchange Page Access Token from User Access Token
 * @param userAccessToken
 * @returns {Promise.<{pageAccessTokens}>}
 */
export const getPageAccessTokens = async userAccessToken => {
  const res = await axios.get(`${endpoint}/me/accounts`, {
    params: { access_token: userAccessToken }
  })

  const { data: { data: pageAccessTokens } } = res
  return { pageAccessTokens }
}

/**
 * General function to call to metric
 * @param pageId
 * @param access_token
 * @param date_preset
 * @param period
 * @param metric
 * @returns {Promise<any>}
 */
export const callMetric = async ({ pageId, access_token, date_preset, period, metric }) => {
  return await axios.get(`${endpoint}/${pageId}/insights`, {
    params: {
      metric,
      period,
      access_token,
      date_preset
    }
  })
}

/**
 * Data return from facebook really nested
 * Get the first values out
 * @param res
 */
export const extractDataFromGraphRes = res => {
  const { data: resBody } = res
  const { error, data } = resBody
  if (error) throw new Error("[ERR] Fetch facebook graph api")
  if (data.length === 0) return []
  const firstData = data[0]
  const { values } = firstData
  return values
}

export const pageImpressions = async ({ pageId, pageToken: access_token, date_preset, period, metric }) => {
  date_preset = date_preset || "this_month"
  period = period || "day"
  metric = metric || "page_impressions"
  const res = await callMetric({ pageId, access_token, date_preset, period, metric })
  const { data: impressions } = res
  return { impressions }
}

export const pageEngagedUsers = async ({ pageId, pageToken: access_token, date_preset, period, metric }) => {
  date_preset = date_preset || "this_month"
  period = period || "day"
  metric = metric || "page_engaged_users"
  const res = await callMetric({ pageId, access_token, date_preset, period, metric })
  const { data: engagements } = res
  return { engagements }
}

export const pagePostEngagements = async ({ pageId, pageToken: access_token, date_preset, period, metric }) => {
  date_preset = date_preset || "this_month"
  period = period || "day"
  metric = metric || "page_post_engagements"
  const res = await callMetric({ pageId, access_token, date_preset, period, metric })
  const { data: post_engagements } = res
  return { post_engagements }
}

export const pageReactions = async ({ pageId, pageToken: access_token, date_preset, period, metric }) => {
  // const promiseArr = metricReactions.map(async metricName => {
  //   _("[metricName]", metricName)
  //   const res = await callMetric({pageId, access_token, date_preset, period, metricName})
  //   return res.data
  // })
  //
  // const reactions = await Promise.all(promiseArr)
  // return {reactions}
  date_preset = date_preset || "this_month"
  period = period || "day"
  metric = metric || "page_actions_post_reactions_total"
  const res = await callMetric({ pageId, access_token, date_preset, period, metric })
  const { data: reactions } = res
  return { reactions }
}

/**
 * Transform func to read gender ages data
 * @param values
 * @returns {Array}
 */
export const transformGenderAgesData = values => {
  const totalSample = values.length
  const genderAges = values.reduce((carry, vObj) => {
    const value = vObj.value
    Object.keys(value).forEach(key => {
      // Extract (gender, age-range) from key name
      // value: {F.13-17: 8}
      // key: F.13-17 >>> gender: "F", age: "13-17"
      const [gender, age] = key.split(".")
      const genderVal = +value[key]
      if (gender === "U") return

      // Update total gender
      const ageGroup = carry[age] || { name: age, F: 0, M: 0 }
      ageGroup[gender] = ageGroup[gender] + genderVal
      carry[age] = ageGroup
    })

    return carry
  }, {})

  // Get average
  Object.values(genderAges).forEach(group => {
    group.F = Math.floor(group.F / totalSample)
    group.M = Math.floor(group.M / totalSample)
  })

  return Object.values(genderAges)
}

/**
 * Average fans by gender & age
 * @param pageId
 * @param access_token
 * @param date_preset
 * @param period
 * @param metric
 * @returns {Promise.<{gender_ages}>}
 */
export const pageGenderAges = async ({ pageId, pageToken: access_token, date_preset, period, metric }) => {
  _(pageId, access_token)
  date_preset = date_preset || "this_month"
  period = period || "lifetime"
  metric = metric || "page_fans_gender_age"
  const res = await callMetric({ pageId, access_token, date_preset, period, metric })
  const values = extractDataFromGraphRes(res)
  const gender_ages = transformGenderAgesData(values)
  return { gender_ages }
}
