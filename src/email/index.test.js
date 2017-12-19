import { sendEmail } from "./index"
import dotenv from "dotenv"

dotenv.config()

const { MAIL_FROM_ADDRESS: mailFrom } = process.env
const _ = console.log

/* Quick test area */
;(async () => {
  const TEST_CASE = "Test send email"
  let pass = true

  try {
    const msg = {
      to: "lehoanganh25991@gmail.com",
      from: mailFrom,
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>"
    }

    sendEmail(msg)
  } catch (err) {
    _(err)
    pass = false
  } finally {
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
