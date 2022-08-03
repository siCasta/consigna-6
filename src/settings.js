import express from 'express'
import path from 'path'
import { errorHandler, notFound } from './errors/index.js'
import { __dirname } from './__dirname.js'
import apiV1 from './api/routes/index.js'
import web from './web/routes/index.js'

const app = express()

// settings
app.set('views', path.join(__dirname, './web/views'))
app.set('view engine', 'ejs')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// static files
app.use(express.static(path.join(__dirname, '../public')))

// routes
app.use('/api', apiV1)
app.use('/', web)

// error handler
app.use(notFound)
app.use(errorHandler)

export default app