import cpf from "child_process"
import path from "path"
import dotenv from "dotenv"
import fs from "fs"

const _ = console.log
const projectPath = path.join(__dirname, "/..")

dotenv.config()
const { MYSQL_ROOT_USER: root, MYSQL_ROOT_PASS: rootpass, DB_USER: user = "gobear", DB_PASS: pass } = process.env

// Cant store "create user sql" in file, bcs it contain dynamic pass
// Build from .env conf
const userSql = `CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY '${pass}';GRANT SELECT, EXECUTE, SHOW VIEW, ALTER, ALTER ROUTINE, CREATE, CREATE ROUTINE, CREATE TEMPORARY TABLES, CREATE VIEW, DELETE, DROP, EVENT, INDEX, INSERT, REFERENCES, TRIGGER, UPDATE, LOCK TABLES  ON \`gobear\`.* TO 'gobear'@'localhost' WITH GRANT OPTION;`
_("[INFO] Write user.sql file")
fs.writeFileSync(path.join(__dirname, "user.sql"), userSql)

_("[INFO] Migration database skeleton")
_(cpf.execSync(`mysql -u ${root} --password=${rootpass} < ${path.join(__dirname, "sql.sql")}`).toString())
_(cpf.execSync(`mysql -u ${root} --password=${rootpass} < ${path.join(__dirname, "user.sql")}`).toString())
