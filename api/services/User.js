'use strict'

import axios from 'axios'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { ErrorObject } from '../../lib'
import { ERRORS } from '../constants'
import { UserModel, TransactionModel } from '../models'

const TOKEN_SECRET = '16165ab142cb7c642f19e4731b86b959'
const ALPHA_PRE = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='
const ALPHA_SUFFIX = '&interval=5min&apikey=S0QJ8YWOW6F8JQGFs'

export const UserService = {
  login,
  signUp,
  dashboard,
  validate
}

async function login (attrs) {
  const { username, password } = attrs

  const filter = { username }
  const user = await UserModel.findOne(filter).lean()
  const { password: hash, userInfo } = user
  const isValidPassword = await bcrypt.compare(password, hash)

  if (!isValidPassword) {
    throw new ErrorObject(...ERRORS.INVALID_CRED)
  }

  const claims = { username }
  const { token } = await _generateToken(claims)
  return { claims, token, username }
}

async function signUp (attrs) {
  const password = await bcrypt.hash(attrs.password, 10)
  const put = {
    ...attrs,
    password
  }

  const user = new UserModel(put)
  await user.save()
}

async function validate (request, response, next) {
  try {
    const token = request.cookies.token || ''
    const user = jsonwebtoken.decode(token)

    const tokenVerify = jsonwebtoken.verify(token, `${TOKEN_SECRET}`)
    if (!tokenVerify) {
      throw new ErrorObject(...ERRORS.VERIFICATION_ERROR)
    }

    request.user = user
    next()
  } catch (e) {
    throw new ErrorObject(...ERRORS.VERIFICATION_ERROR)
  }
}

async function dashboard (username) {
  const [fbRes, googleRes, appleRes, user, transations] = await Promise.all([
    axios.get(`${ALPHA_PRE}FB${ALPHA_SUFFIX}`),
    axios.get(`${ALPHA_PRE}GOOG${ALPHA_SUFFIX}`),
    axios.get(`${ALPHA_PRE}AAPL${ALPHA_SUFFIX}`),
    UserModel.findOne({username}, {'password': 0, '_id': 0}).lean(),
    TransactionModel.find({username},{'__v': 0, '_id': 0}).lean()
  ])

  const { data: fb } = fbRes
  const { data: google } = googleRes
  const { data: apple } = appleRes

  console.log({fb, google, apple});
  const labels = Object.keys(fb['Time Series (5min)']).slice(0, 10).reverse()
  const fbData = []
  const googleData = []
  const appleData = []

  for (let time of labels) {
    fbData.push(Number(fb['Time Series (5min)'][time]['1. open']))
    googleData.push(Number(google['Time Series (5min)'][time]['1. open']))
    appleData.push(Number(apple['Time Series (5min)'][time]['1. open']))
  }

  fbData.reverse()
  googleData.reverse()
  appleData.reverse()

  return { labels, fbData, googleData, appleData, user, transations }
}

async function _generateToken (claims) {
  const jwt = jsonwebtoken.sign(claims, `${TOKEN_SECRET}`, { expiresIn: '30m' })
  return { token: jwt }
}
