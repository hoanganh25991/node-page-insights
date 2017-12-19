import dotenv from "dotenv"
import Sequelize from "sequelize"

const _ = console.log

dotenv.config()
const {
  DB_DIALECT: dialect = "mysql",
  DB_HOST: host = "localhost",
  DB_PORT: port = 3306,
  DB_NAME: database = "gobear",
  DB_USER: username = "gobear",
  DB_PASS: password,
  TIMEZONE: timezone = "+08:00"
} = process.env

if (!password) {
  _(`
Please add .env file in project
Provide DB_PASS to run mysql
// .env file
DB_PASS=password`)

  throw new Error("Not enough conf to run MySQL")
}

export const sequelize = new Sequelize({
  database,
  username,
  password,
  dialect,
  host,
  port,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone
})

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
