import moment from "moment"
import { Op } from "sequelize"
import { Prize } from "./models/Prize"
import { Entry } from "./models/Entry"
import { Campaign } from "./models/Campaign"
import { MYSQL_TIMESTAMP_FORMAT } from "./util"

const _ = console.log

export const getAllCamps = async () => {
  return await Campaign.findAll()
}

export const getCamp = async code => {
  return await Campaign.findOne({ where: { code, enabled: 1 } })
}

export const getEntry = async id => {
  return await Entry.findOne({ where: { id } })
}

export const getPrize = async id => {
  return await Prize.findOne({ where: { id } })
}

// export const getPrizes = async campaign_id => {
//   return await Prize.findAll({ where: { campaign_id } })
// }

export const getEntries = async ({ campaign_id, email }) => {
  return await Entry.findAll({ where: { email, campaign_id, prize_id: null } })
}

export const checkElg = async ({ code, email }) => {
  const camp = await getCamp(code)
  if (!camp) return { err: { msg: `Campaign ${code}: not found` } }
  const entries = await getEntries({ campaign_id: camp.id, email })
  const eligibility = entries && entries.length > 0
  return { eligibility }
}

export const getEntryWithCountPrize = async () => {
  const sequelize = Entry.sequelize
  return await Entry.findAll({
    group: ["prize_id"],
    attributes: ["prize_id", [sequelize.fn("COUNT", "prize_id"), "quantity_used"]]
  })
}

export const getSummaryPrizeQuantityUsed = async () => {
  const entries = await getEntryWithCountPrize()
  const summary = entries.reduce((carry, summaryEntry) => {
    const { prize_id } = summaryEntry
    if (!prize_id) return carry

    const quantity_used = summaryEntry.get("quantity_used")
    return { ...carry, [prize_id]: quantity_used }
  }, {})

  return { summary }
}

export const getAvailPrizes = async code => {
  const now = moment().format(MYSQL_TIMESTAMP_FORMAT)

  // Find available campaign
  const campaign = await Campaign.findOne({
    where: {
      code,
      enabled: 1,
      [Op.and]: [{ start_date: { [Op.lte]: now } }, { end_date: { [Op.gte]: now } }]
    }
  })

  if (!campaign) return { campaign }

  // Find available prizes
  const prizes = await Prize.findAll({
    where: {
      enabled: 1,
      [Op.and]: [{ lottery_start_date: { [Op.lte]: now } }, { lottery_end_date: { [Op.gte]: now } }]
    }
  })

  const { summary } = await getSummaryPrizeQuantityUsed()

  // Filter prize has stock
  const inStockPrizes = prizes.filter(prize => {
    const { id: prize_id, quantity_total } = prize
    const quantity_used = summary[prize_id] || 0
    return +quantity_total > +quantity_used
  })

  // Sort by position
  // Only get first 8 prize by position
  inStockPrizes.sort((p1, p2) => +p1.position >= +p2.position)
  const sortedPrizes = inStockPrizes.slice(0, 8)
  return { campaign, prizes: sortedPrizes }
}

export const drawPrize = async ({ code, email }) => {
  const { campaign, prizes } = await getAvailPrizes(code)
  if (!campaign) return { err: { msg: "No campaign available", campaign } }
  if (!prizes || !prizes.length)
    return { err: { msg: "No prize available. Please check prize's lottery date & probability", campaign, prizes } }

  // Build random prizes arr based on prize.probability
  // probability is integer show how many times
  // prizes can duplicate itself to run random
  const rndPrizeArr = prizes.reduce((carry, prize) => {
    let allowedTimes = +prize.probability
    while (allowedTimes--) carry.push(prize)
    return carry
  }, [])

  if (rndPrizeArr.length === 0) return { err: { msg: "No random prizes", campaign, prizes, rndPrizeArr } }

  // Run random
  const winIndex = Math.floor(Math.random() * rndPrizeArr.length)
  const winPrize = rndPrizeArr[winIndex]

  const campaign_id = campaign.id
  const prize_id = winPrize.id

  // Save the entry to db
  const entryData = {
    email,
    campaign_id,
    prize_id,
    modified_date: moment().format(MYSQL_TIMESTAMP_FORMAT)
  }

  const updateCond = { where: { email, campaign_id, prize_id: null } }
  const entry = await Entry.findOne(updateCond)
  if (!entry) return { err: { msg: "Not eligible" } }

  const { err } = await Entry.update(entryData, { where: { id: entry.id } })
    .then(() => ({}))
    .catch(err => ({ err: { msg: "Run update fail", entryData, updateCond, err } }))

  if (err) return { err }

  const savedEntry = await getEntry(entry.id)
  return { entry: savedEntry }
}
