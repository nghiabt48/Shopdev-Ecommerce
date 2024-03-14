const express = require('express')
const morgan = require('morgan')
const {default: helmet} = require('helmet')
const compression = require('compression')
require('dotenv').config()

const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// init DB
require('./databases/init.mongodb')
// init routers
app.use('/', require('./routes/index'))
// handle Errors
app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})
app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error'
  })
})
module.exports = app