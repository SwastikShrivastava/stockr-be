'use strict'

import axios from 'axios'
import { nanoid } from 'nanoid'
import { ErrorObject } from '../../lib'
import { ERRORS } from '../constants'
import { UserModel, TransactionModel } from '../models'

const ALPHA_DOMAIN = 'https://www.alphavantage.co/query?function='
const ALPHA_TOKEN = 'interval=5min&apikey=S0QJ8YWOW6F8JQGFs'
const FINN_DOMAIN = 'https://finnhub.io/api/v1/'
const FINN_TOKEN = 'token=brn7c27rh5rcnlf5htm0'

export const StocksService = {
  searchBySymbol,
  quote,
  buy,
  sell
}

async function buy (attrs) {
  const { symbol, quantity, username } = attrs
  const { price } = await quote(symbol.toUpperCase())

  const txnAmount = price*quantity

  const filter = { username, amount: { $gte: txnAmount } }
  const user = await UserModel.findOne(filter).lean()
  if (!user) {
    throw new ErrorObject(...ERRORS.LOW_BALANCE)
  }

  const txnId = nanoid(10)
  const put = {
    txnId,
    symbol: symbol.toUpperCase(),
    quantity,
    txnAmount,
    price,
    username,
    type: 'BUY'
  }

  const transation = new TransactionModel(put)
  await transation.save()
  // update userInfo
  const updatedAmount = user.amount - txnAmount
  await UserModel.updateOne({username}, {amount: updatedAmount})

  return { txnId, updatedAmount }
}

async function sell (attrs) {
  const { symbol, quantity, username } = attrs
  const { price } = await quote(symbol.toUpperCase())

  const txnAmount = price*quantity

  const query = [
    { $match: { username, symbol: symbol.toUpperCase() } },
    {
      $group: {
        _id: null,
        quantityInHand: { $sum: '$quantity' }
      }
    }
  ]
  const data = await TransactionModel.aggregate(query)
  const { quantityInHand } = data[0]
  if(quantityInHand < quantity) {
    throw new ErrorObject(...ERRORS.LOW_BALANCE)
  }

  const txnId = nanoid(10)
  const put = {
    txnId,
    symbol: symbol.toUpperCase(),
    txnAmount,
    price,
    username,
    quantity: (-1*quantity),
    type: 'SELL'
  }

  const transation = new TransactionModel(put)
  await transation.save()
  // update userInfo
  const user = await UserModel.findOne({username}).lean()
  const updatedAmount = user.amount + txnAmount
  await UserModel.updateOne({username}, {amount: updatedAmount})

  return { txnId, updatedAmount }
}

async function searchBySymbol (symbol) {
  const STOCKS_URL = `${ALPHA_DOMAIN}TIME_SERIES_INTRADAY&symbol=${symbol}&${ALPHA_TOKEN}`
  const BASIC_DETAILS_URL = `${FINN_DOMAIN}stock/profile2?symbol=${symbol}&${FINN_TOKEN}`
  const NEWS_SENTIMENTS_URL = `${FINN_DOMAIN}news-sentiment?symbol=${symbol}&${FINN_TOKEN}`
  const COMAPNY_NEWS_URL = `${FINN_DOMAIN}company-news?symbol=${symbol}&from=2020-06-20&to=2020-06-21&${FINN_TOKEN}`

  // making parallel call to all the details
  const [stockRes, basicDetailsRes, newsSentRes, comNewsRes] = await Promise.all([
    axios.get(STOCKS_URL),
    axios.get(BASIC_DETAILS_URL),
    axios.get(NEWS_SENTIMENTS_URL),
    axios.get(COMAPNY_NEWS_URL)
  ])
  // stock as  per time series
  const { data: stockTS } = stockRes

  const labelsTS = Object.keys(stockTS['Time Series (5min)']).slice(0, 20).reverse()
  const timeSeries = []

  for (let time of labelsTS) {
    timeSeries.push(Number(stockTS['Time Series (5min)'][time]['4. close']))
  }

  timeSeries.reverse()
  const stockPrice = {
    timeSeries,
    labelsTS
  }
  // company basic details
  const { data: cd } = basicDetailsRes
  const basicDetails = {
    name: cd.name,
    ipo: cd.ipo,
    sector: cd.finnhubIndustry,
    marketCap: cd.marketCapitalization,
    outstanding: cd.shareOutstanding,
    logo: cd.logo
  }
  // news sentiment
  const { data: ns } = newsSentRes
  const newsSentiments = {
    sentiment: ns.sentiment,
    newsScore: ns.companyNewsScore
  }
  // company news
  const { data: nws } = comNewsRes
  const newsData = []
  for (let news of nws) {
    const newsObject = {
      headline: news.headline,
      summary: news.summary,
      url: news.url,
    }
    newsData.push(newsObject)
    if (newsData.length > 6) break;
  }

  return { newsSentiments, basicDetails, stockPrice, newsData }
}

async function quote (symbol) {
  const QUOTE_URL = `${ALPHA_DOMAIN}GLOBAL_QUOTE&symbol=${symbol}&${ALPHA_TOKEN}`
  const { data: quote } = await axios.get(QUOTE_URL)

  const generalQuote = quote['Global Quote']
  const price = generalQuote['05. price']
  const low = generalQuote['04. low']
  const high = generalQuote['03. high']

  return { price, low, high }
}
