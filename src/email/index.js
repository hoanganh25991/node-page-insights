import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
import { getEntry, getPrize } from "../mysql/index"
import { prizeHtml } from "./template"

dotenv.config()
const { SENDGRID_API_KEY: token, MAIL_FROM_ADDRESS: mailFrom } = process.env
const _ = console.log

sgMail.setApiKey(token)

export const getPrizeInfo = async entry_id => {
  const entry = await getEntry(entry_id)
  if (!entry) return { err: { msg: "No entry found", entry_id } }
  const { prize_id } = entry
  if (!prize_id) return { err: { msg: "User not yet draw prize", entry_id, prize_id } }
  const prize = await getPrize(prize_id)
  if (!prize) return { err: { msg: "Oops! No prize data for your entry", entry_id, prize_id } }
  const { winning_instruction: prizeInfo } = prize
  return { entry, prizeInfo }
}

export const sendPrizeInfo = async entry_id => {
  const { entry, prizeInfo, err: err1 } = await getPrizeInfo(entry_id)
  if (err1) return { err: err1 }

  const { email } = entry
  const text = prizeInfo ? prizeInfo : "."
  const html = prizeHtml(text)
  const msg = {
    html,
    from: mailFrom,
    to: email,
    subject: "[GoBear] PRIZE INFO",
    text
  }
  const wait = sendEmail(msg)
    .then(() => ({ beingSent: true }))
    .catch(err => {
      _(err)
      return { beingSent: false, err }
    })
  const { beingSent, err } = await wait
  return { beingSent, err }
}

export const sendEmail = ({ from, to, subject, text, html }) => {
  const msg = { to, from, subject, text, html }
  return sgMail.send(msg)
}
