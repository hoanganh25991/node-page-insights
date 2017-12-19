import path from "path"
import helmet from "helmet"
import logger from "morgan"
import express from "express"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import { index } from "./routes/index"
import cookieParser from "cookie-parser"
import { cronCleanUp as cronCleanToken } from "./token/index"
import { errMiddleWare, apiMiddleware, injectReqUri } from "./api/index"
import cors from "cors"

const app = express()
const _ = console.log

app.use(cors())
app.use(helmet())
app.use(logger("dev"))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(favicon(path.join(__dirname, "public", "favicon.ico")))

// Cron
cronCleanToken()

// Router
app.use(errMiddleWare)
app.use(apiMiddleware)
app.use(injectReqUri)
app.use("/api", index)

module.exports = app
