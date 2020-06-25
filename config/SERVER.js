'use strict'

import { getConfig } from '../lib'

const REQUIRED_CONFIG = [
  'PORT',
  'BODY_LIMIT',
  'CORS_ORIGIN',
  'CORS_METHODS'
]

const SERVER_CONFIG = getConfig('SERVER', REQUIRED_CONFIG)
export { SERVER_CONFIG }
