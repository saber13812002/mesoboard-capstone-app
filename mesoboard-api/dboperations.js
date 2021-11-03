var config = require('./dbconfig')
const sql = require('mssql')

async function getUsers() {
  console.log('trying to connect...')
  try {
    let pool = await sql.connect(config)
    console.log('connect!')
    let users = await pool.request().query('select * from Users')
    console.log('users.recordsets', users.recordsets)
    return users.recordsets
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  getUsers: getUsers
}