'use strict'

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './api/routes'
import startServer from './startServer'
import { SERVER_CONFIG, FE_CONFIG } from './config'
import { setSecurityHeaders } from './lib'

const { BODY_LIMIT, CORS_ORIGIN, CORS_METHODS, RATE_LIMIT_TIME, RATE_LIMIT_MAX } = SERVER_CONFIG
const { DOMAIN } = FE_CONFIG;
const corsOptions = {
  origin: DOMAIN,
  methods: CORS_METHODS,
  credentials: true
}

const app = express()
// Security Headers
setSecurityHeaders(app)
// Middleware Initializations
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: BODY_LIMIT }))
app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }))

// Initialize Routes
routes.init(app, '/api')

// Start Server
startServer(app)
