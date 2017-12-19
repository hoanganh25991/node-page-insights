import express from "express"
import { api } from "../api/index"

const router = express.Router()
const _ = console.log

router.get("/", function(req, res) {
  res.send("Welcome to gobear")
})

router.post("/", async (req, res) => {
  const { resData, statusCode } = await api(req.body)
  res.status(statusCode)
  res.json(resData)
})

export const index = router
