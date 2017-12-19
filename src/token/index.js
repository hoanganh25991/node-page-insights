import jwt from "jsonwebtoken"
import fs from "fs"
import dotenv from "dotenv"
import crypto from "crypto"
import { promisify } from "util"
import path from "path"
import moment from "moment"

const _ = console.log

dotenv.config()
const {
  SECRET_KEY: secret = "secret",
  JWT_EXPIRE: expiresIn = 86400000,
  JWT_DIR: jwtDir = "storage",
  DIGEST_ALGORITHM: hashAlg = "SHA",
  JWT_FILE_OLDER_THAN: fileOlderThan = 4320,
  JWT_CLEAN_UP_INTERVAL: cleanUpInterval = 4320
} = process.env

export const genToken = data => {
  return jwt.sign(data, secret, { expiresIn })
}

export const genTknPath = fileName => path.join(__dirname, jwtDir, fileName)
export const getTknDir = () => path.join(__dirname, jwtDir)

export const decodeToken = async fileName => {
  const tknPath = genTknPath(fileName)
  const exist = fs.existsSync(tknPath)
  if (!exist) {
    const err = { msg: "Token removed" }
    return { err }
  }

  const tkn = fs.readFileSync(tknPath, { encoding: "utf8" })
  const { err, data } = await new Promise(rslv => {
    jwt.verify(tkn, secret, (err, data) => rslv({ err, data }))
  })
  return { err, data }
}

export const storeToken = ({ token, fileName }) => {
  const tknPath = genTknPath(fileName)
  fs.writeFileSync(tknPath, token)
}

export const hashStr = ({ code, email, timestamp }) => {
  return `${code}+${email}+${timestamp}`
}

export const genFileName = ({ code, email, timestamp: _timestamp = null }) => {
  const hash = crypto.createHash(hashAlg)
  const timestamp = _timestamp || Math.floor(new Date().getTime() / 1000)
  hash.update(hashStr({ code, email, timestamp }))
  return hash.digest("hex").toString()
}

export const _cleanUp = async () => {
  const tknDir = getTknDir()
  const files = await promisify(fs.readdir)(tknDir)

  const waits = files.map(async name => {
    if (name === ".gitignore") return
    const filePath = path.join(tknDir, name)
    const stat = await promisify(fs.stat)(filePath)
    const now = Math.floor(new Date().getTime() / 1000)
    const fileTime = Math.floor(new Date(stat.ctime).getTime() / 1000)
    const tooOld = now - (fileTime + +fileOlderThan * 60)
    if (!tooOld) return
    const wait = promisify(fs.unlink)(filePath)
    wait.catch(err => null)
    return wait
  })

  await waits
}

/**
 * Run interval when file required
 */
export const cronCleanUp = () => {
  const timeout = setInterval(() => {
    _cleanUp()
      .then(() => _("Token clean up: finished"))
      .catch(err => _(err))
  }, +cleanUpInterval * 60 * 1000)

  process.on("exit", err => {
    if (err) _(err.stack)
    _("Remove token clean up interval")
    clearInterval(timeout)
  })

  process.on("SIGINT", process.exit)
  process.on("SIGUSR1", process.exit)
  process.on("SIGUSR2", process.exit)
  process.on("uncaughtException", process.exit)
}

/**
 * When user hacked, token leaked
 * Give {code, email, timeRange}
 * We try to remove all these matched token's file
 * @param code
 * @param email
 * @param startTime
 * @param endTime
 * @returns {Promise.<void>}
 */
export const removeLeakedToken = async ({ code, email, timeRange: [startTime, endTime] }) => {
  const startMnt = moment(startTime, "X")
  const endMnt = moment(endTime, "X")
  let curMnt = startMnt.clone()
  let waitArr = []
  const chunkSize = 500

  do {
    _("check at", curMnt.format("X"))
    const fileName = genFileName({ code, email, timestamp: curMnt.format("X") })
    const filePath = genTknPath(fileName)
    const wait = promisify(fs.unlink)(filePath).catch(err => null)
    waitArr.push(wait)

    // Increase curMnt
    curMnt = curMnt.add(1, "s")

    // Too much promise push in
    // Wait for it resolved before move on
    const overWhelm = waitArr.length > chunkSize
    if (!overWhelm) continue
    await Promise.all(waitArr)
    waitArr = []
  } while (curMnt.isBefore(endMnt))

  await Promise.all(waitArr)
}

// Run
// cronCleanUp()

/**
 * Token
 * Only give user token's file name
 * Actual token is jwt, which stored in file
 * Why store jwt in file? (Instead of send back jwt as token)
 * Security. When token leaked, removing token file invalid leaked token
 * @param code
 * @param email
 * @returns {*}
 */
export const tinyToken = ({ code, email }) => {
  try {
    const token = genToken({ code, email })
    const fileName = genFileName({ code, email })
    storeToken({ token, fileName })
    return { token: fileName }
  } catch (err) {
    _(err)
    return { err }
  }
}
