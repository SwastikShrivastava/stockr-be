'use strict'

import axios from 'axios'
import { ResponseBody, ErrorObject } from '../../lib'
import { StocksService } from '../services'

export const StocksController = {
  search,
  searchBySymbol,
  quote,
  buy,
  sell
}

async function search (request, response) {
  const { data } = await axios.get('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=brn7c27rh5rcnlf5htm0')

  const keys = []
  const values = []

  for (let match of data) {
    keys.push(Object.values(match)[0] + ' ' + Object.values(match)[2])
    values.push('')
  }

  const result = {}
  keys.forEach((key, i) => result[key] = values[i])

  const responseBody = new ResponseBody(200, result)
  response.send(responseBody)
}

async function searchBySymbol (request, response) {
  const { params } = request
  const { symbol } = params

  const data = await StocksService.searchBySymbol(symbol.toUpperCase())

  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}

async function quote (request, response) {
  const { params } = request
  const { symbol } = params

  const data = await StocksService.quote(symbol.toUpperCase())

  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}

async function buy (request, response) {
  const { params, body } = request
  const { symbol } = params

  const data = await StocksService.buy({...body, symbol})

  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}

async function sell (request, response) {
  const { params, body } = request
  const { symbol } = params

  const data = await StocksService.sell({...body, symbol})

  const responseBody = new ResponseBody(200, data)
  response.send(responseBody)
}
