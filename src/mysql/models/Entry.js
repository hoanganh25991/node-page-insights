import { sequelize } from "../connection"
import Sequelize from "sequelize"
import { convertTimestamp } from "../util"

// Models are defined with sequelize.define('name', {attributes}, {options}).
export const Model = sequelize.define(
  "Entry",
  {
    email: {
      type: Sequelize.STRING
    },
    campaign_id: {
      type: Sequelize.BIGINT(11)
    },
    prize_id: {
      type: Sequelize.BIGINT(11)
    },
    created_date: {
      type: Sequelize.STRING
    },
    modified_date: {
      type: Sequelize.STRING
    },
    prize_awarded_timestamp: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false, tableName: "entries" }
)

convertTimestamp(Model, ["created_date", "modified_date", "prize_awarded_timestamp"])
export const Entry = Model
