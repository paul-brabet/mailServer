const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')

// Node mailer example at https://nodemailer.com/usage/ doesn't have 'null'
const transport = nodemailer.createTransport(transport[null, defaults])

router.post('/receivedEmail', (req, res => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message

}))