import { sequelize } from "../connection"
import Sequelize from "sequelize"
import { convertTimestamp, convertImagUrl } from "../util"

// Models are defined with sequelize.define('name', {attributes}, {options}).
const Model = sequelize.define(
  "Campaign",
  {
    title: {
      type: Sequelize.STRING
    },
    code: {
      type: Sequelize.STRING
    },
    img_url: {
      type: Sequelize.TEXT("tiny")
    },
    enabled: {
      type: Sequelize.INTEGER
    },
    start_date: {
      type: Sequelize.STRING
    },
    end_date: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false, tableName: "campaigns" }
)

convertTimestamp(Model, ["start_date", "end_date"])
convertImagUrl(Model, ["img_url"])
export const Campaign = Model
