import { sequelize } from "./connection"
const _ = console.log

const TEST_CASE = "Test db connection"
let pass = true
;(async () => {
  const wait = new Promise(resolve => {
    sequelize
      .authenticate()
      .then(() => {
        pass = pass && true
        resolve(pass)
      })
      .catch(err => {
        _(err)
        pass = pass && false
        resolve(pass)
      })
  })

  try {
    await wait
  } catch (err) {
    pass = false
  } finally {
    await sequelize.close()
    pass ? _(`\x1b[42m[PASS]\x1b[0m ${TEST_CASE}`) : _(`\x1b[41m[FAIL]\x1b[0m ${TEST_CASE}`)
  }
})()
