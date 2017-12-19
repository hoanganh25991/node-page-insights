import moment from "moment"
import dotenv from "dotenv"

dotenv.config()
const { PROXY_PASS_URL: prefix = "gobear" } = process.env
const _ = console.log

export const MYSQL_TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss"

export const toTimestamp = dateStr => {
  const date = moment(dateStr, MYSQL_TIMESTAMP_FORMAT).utcOffset(0)
  if (!date.isValid()) return null
  return +date.format("X")
}

export const convertTimestamp = (model, fields = []) => {
  const _toJSON = model.prototype.toJSON
  model.prototype.toJSON = function() {
    const modelObj = _toJSON.bind(this)()
    const fieldTimestamps = fields.reduce((carry, field) => {
      const dateStr = modelObj[field]
      carry[field] = toTimestamp(dateStr)
      return carry
    }, {})

    return { ...modelObj, ...fieldTimestamps }
  }
}

export const convertImagUrl = (model, fields = []) => {
  const _toJSON = model.prototype.toJSON
  model.prototype.toJSON = function() {
    const modelObj = _toJSON.bind(this)()
    const fieldImgUrls = fields.reduce((carry, field) => {
      const imgUrl = modelObj[field]
      carry[field] = imgUrl ? `${process.reqRoot}/${prefix}/uploads/${imgUrl}` : imgUrl
      return carry
    }, {})

    return { ...modelObj, ...fieldImgUrls }
  }
}
