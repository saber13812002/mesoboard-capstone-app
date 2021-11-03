const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/users', (req, res) => {
  const query = 'select * from users;'

  db.any(query).then(users => {
    return res.status(200).json({ data: users })
  }).catch(err => {
    console.error(err)
  })
})