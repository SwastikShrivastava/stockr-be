'use strict'

import fs from 'fs'
import { getConfig } from '../lib'

const REQUIRED_CONFIG = [
  'DBNAME',
  'HOST',
  'PORT',
  'USERNAME',
  'PASSWORD'
]

const {
  DBNAME,
  HOST,
  PORT,
  USERNAME,
  PASSWORD
} = getConfig('MONGO', REQUIRED_CONFIG)

const MONGO_CONFIG = {
  CONNECTION_URI: [
    HOST,
    '/',
    DBNAME
  ].join(''),

  OPTIONS: {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
}

export { MONGO_CONFIG }
