'use strict'

import express from 'express'
import { StocksController } from '../controllers'
import { UserService } from '../services'
import { asyncWrapper, validation } from '../utils'

const StocksRouter = express.Router()

StocksRouter.use(asyncWrapper(UserService.validate))

StocksRouter.get('/', asyncWrapper(StocksController.search))
StocksRouter.get('/:symbol', asyncWrapper(StocksController.searchBySymbol))
StocksRouter.get('/quote/:symbol', asyncWrapper(StocksController.quote))
// Transaction related
StocksRouter.post('/buy/:symbol', asyncWrapper(StocksController.buy))
StocksRouter.post('/sell/:symbol', asyncWrapper(StocksController.sell))


export { StocksRouter }
