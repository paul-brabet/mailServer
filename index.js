var path = require("path")
var express = require("express")
var fs = require('fs')
var logger = require("morgan")
var nodemailer = require('nodemailer')
var mg = require('nodemailer-mailgun-transport')
var bodyParser = require('body-parser')
var nconf = require('nconf')
  // var auth = require('./config.json')
var auth = {
  auth: {
    api_key: process.env.API_KEY,
    domain: process.env.DOMAIN
  }
}
const port = process.env.PORT || 3000

// make a request app and create the server 
var app = express()
var server = require('http').createServer(app)

// include client-side assets and use the bodyParser
app.use(express.static(__dirname + '/public'))
  // app.use(express.static(__dirname + '/assets'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// log requests to stdout and also
// log HTTP requests to a file in combined format
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
app.use(logger('dev'))
app.use(logger('combined', { stream: accessLogStream }))

// enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.PAGE);
  next();
});

// route for email
app.post('/receivedEmail', (req, res) => {
  const name = clean(req.body.name)
  const email = clean(req.body.email)
  const message = clean(req.body.message)

  // clean the received message
  function clean(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  // create transporter object capable of sending email using the default SMTP transport
  var transporter = nodemailer.createTransport(mg(auth))

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: name + ' <' + email + '>', // sender address
    to: 'contactpaullb@gmail.com', // list of receivers
    subject: 'Message from Website Contact page', // Subject line
    text: message,
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.json({ yo: error })
    } else {
      res.json({ yo: 'Success' })
    }
  })
})

server.listen(port, function() {
  console.log('Server is listening on port', port)
})