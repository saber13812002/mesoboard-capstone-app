const pgp = require('pg-promise')()
const db = pgp('postgresql://admin:meso_2021@localhost:5432/mesodb')

module.exports = db;