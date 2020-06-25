'use strict'

import cookie from 'cookie'
import { ResponseBody, ErrorObject } from '../../lib'
import { UserModel } from '../models'
import { UserService } from '../services'

export const UserController = {
  login,
  logout,
  signUp,
  dashboard,
  addMoney
}

async function login (request, response) {
  const { body } = request
  const data = await UserService.login(body)
  const { token } = data
  // Set cookie to header
  response.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: false,
    secure: false,
    maxAge: 3000,
    path: '/'
  }))

  delete data.token
  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}

async function logout (request, response) {
  await UserService.logout(request)
  const responseBody = new ResponseBody(200)
  response.send(responseBody)
}

async function signUp (request, response) {
  const { body } = request
  await UserService.signUp(body)

  const responseBody = new ResponseBody(200)
  response.send(responseBody)
}

async function dashboard (request, response) {
  const { params } = request
  const { username } = params

  const data = await UserService.dashboard(username)

  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}

async function addMoney (request, response) {
  const { body } = request
  const { username, value } = body

  const { amount } = await UserModel.findOne({username}).lean()
  const updatedAmount = amount + value
  await UserModel.updateOne({username}, {amount: updatedAmount})

  const responseBody = new ResponseBody(200, {updatedAmount})
  response.send(responseBody)
}
