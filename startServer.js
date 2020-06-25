'use strict'

import mongoose from 'mongoose'
import { MONGO_CONFIG, SERVER_CONFIG } from './config'

const { PORT } = SERVER_CONFIG
const { CONNECTION_URI, OPTIONS, USERNAME } = MONGO_CONFIG

const startServer = async (app) => {
  try {
    await mongoose.connect(CONNECTION_URI, OPTIONS)
    console.log('[INFO] Connected to MongoDB, User: ', USERNAME)

    await app.listen(PORT)
    console.log(`[INFO] Server started on Port: ${PORT}`)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default startServer
