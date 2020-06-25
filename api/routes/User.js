'use strict'

import express from 'express'
import { UserController } from '../controllers'
import { UserService } from '../services'
import { asyncWrapper, validation } from '../utils'

const UserRouter = express.Router()

UserRouter.post('/login', asyncWrapper(UserController.login))
UserRouter.post('/sign-up', asyncWrapper(UserController.signUp))
UserRouter.get(
  '/dashboard/:username',
  asyncWrapper(UserService.validate),
  asyncWrapper(UserController.dashboard)
)
UserRouter.post(
  '/add-money',
  asyncWrapper(UserService.validate),
  asyncWrapper(UserController.addMoney)
)

export { UserRouter }
