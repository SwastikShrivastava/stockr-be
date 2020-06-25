'use strict'

import helmet from 'helmet'

export function setSecurityHeaders (app) {
  app.disable('etag')

  app.use(helmet({
    hsts: false
  }))

  app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }))

  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    }
  }))

  app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' https://apis.google.com https://unpkg.com; worker-src 'self' blob:"
    )
    return next()
  })
}
