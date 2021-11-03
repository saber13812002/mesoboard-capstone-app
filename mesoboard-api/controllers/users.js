const db = require('../db')

exports.hello = async (req, res, next) => {
  return res.status(200).json('Hello World')
}

exports.getAllUsers = (req, res, next) => {
  const query = 'select * from users;'

  return db.any(query).then(users => {
    // res.status(200).json({ data: users })
    // next() 
    return res.status(200).json({ data: users })
  }).catch(err => {
    console.error(err)
  })
}

