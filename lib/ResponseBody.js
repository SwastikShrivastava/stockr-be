'use strict'

import http from 'http'

// Response Body's Standard Data Structure Class
export class ResponseBody {
  constructor (statusCode, data) {
    this.statusCode = statusCode
    this.message = http.STATUS_CODES[statusCode]
    this.data = data
  }
}
