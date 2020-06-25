'use strict'

import packageJSON from '../../package.json'
import { ErrorObject, ResponseBody } from '../../lib'
import { SERVER_CONFIG } from '../../config'
import { UserRouter } from './User'
import { StocksRouter } from './Stocks'

const { version } = packageJSON
const routes = [
  { path: '/user', router: UserRouter },
  { path: '/stocks', router: StocksRouter }
]

routes.init = (app, prefix) => {
  if (!app || !app.use) {
    console.error(
      '[Error] Route Initialization Failed: app / app.use is undefined'
    )
    return process.exit(1)
  }

  routes.forEach(route => {
    if (route.excludeVersion) {
      const path = [prefix, route.path].join('')
      app.use(path, route.router)
    } else {
      const pathWithVersion = [prefix, '/v', version.split('.')[0], route.path].join('')
      app.use(pathWithVersion, route.router)
    }
  })

  // Health Check API
  app.get(`${prefix}/health-check`, (request, response, next) => {
    const responseBody = new ResponseBody(200)
    response.json(responseBody)
  })

  // Version Check API
  app.get(`${prefix}/version`, (request, response, next) => {
    const data = { version }
    const responseBody = new ResponseBody(200, data)
    response.json(responseBody)
  })

  // Handle 404 Errors
  app.use('*', (request, response, next) => {
    const message = ['Cannot', request.method, request.originalUrl].join(' ')
    const errorObject = new ErrorObject(404, message)
    next(errorObject)
  })

  app.use((error, request, response, next) => {
    // Invalid JSON Body
    const isParseError = error instanceof SyntaxError && error.status === 400
    if (isParseError) {
      const errorObject = new ErrorObject(400, 'Invalid JSON Body')
      return response.status(400).json(errorObject)
    }

    // Custom Error
    if (error.statusCode) {
      return response.status(error.statusCode).json(error)
    }

    // Internal Server Error
    console.error('[Error]', error)
    const errorObject = new ErrorObject(500)
    return response.status(500).json(errorObject)
  })
}

export default routes
