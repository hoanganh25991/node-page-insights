import { sequelize } from "../connection"
import Sequelize from "sequelize"
import { convertTimestamp, convertImagUrl } from "../util"

// Models are defined with sequelize.define('name', {attributes}, {options}).
export const Model = sequelize.define(
  "Prize",
  {
    name: {
      type: Sequelize.STRING
    },
    img_url: {
      type: Sequelize.TEXT("tiny")
    },
    position: {
      type: Sequelize.INTEGER
    },
    campaign_id: {
      type: Sequelize.BIGINT(11)
    },
    enabled: {
      type: Sequelize.INTEGER
    },
    probability: {
      type: Sequelize.INTEGER
    },
    quantity_total: {
      type: Sequelize.INTEGER
    },
    quantity_available: {
      type: Sequelize.INTEGER
    },
    lottery_start_date: {
      type: Sequelize.STRING
    },
    lottery_end_date: {
      type: Sequelize.STRING
    },
    winning_instruction: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false, tableName: "prizes" }
)

convertTimestamp(Model, ["lottery_start_date", "lottery_end_date"])
convertImagUrl(Model, ["img_url"])
export const Prize = Model
