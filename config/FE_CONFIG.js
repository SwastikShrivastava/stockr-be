'use strict'

import { getConfig } from '../lib'

const REQUIRED_CONFIG = [
  'DOMAIN',
]

const FE_CONFIG = getConfig('FE', REQUIRED_CONFIG)
export { FE_CONFIG }
