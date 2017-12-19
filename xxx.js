import fs from "fs"
const str = fs.readFileSync(".env.json")
console.log(str.toString())
console.log(JSON.parse(str))
