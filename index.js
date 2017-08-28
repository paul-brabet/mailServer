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
  api_key: API_KEY,
  domain: DOMAIN
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

// FOR TESTING PURPOSES ONLY
app.get('/', (req, res) => {
  res.sendFile('home.html', { root: __dirname })
})

app.post('/receivedEmail', (req, res) => {
  const name = clean(req.body.name)
  const email = clean(req.body.email)
  const message = clean(req.body.message)

  function clean(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  console.log('\nCONTACT FORM DATA: ' + name + ' ' + email + ' ' + message + '\n')

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
      console.log('\nERROR: ' + error + '\n')
        //   res.json({ yo: 'error' })
    } else {
      res.redirect('/success')
    }
  })
})

app.get('/success', (req, res) => {
  res.sendFile('success.html', { root: __dirname })
})

server.listen(port, function() {
  console.log('Server is listening on port', port)
})