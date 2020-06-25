'use strict'

import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  txnId: { type: String },
  symbol: { type: String },
  type: { type: String },
  txnAmount: { type: Number },
  quantity: { type: Number },
  price: { type: Number },

  username: { type: String }
}, { timestamps: true })

TransactionSchema.index({ txnId: 1 }, { unique: true })

const TransactionModel = mongoose.model('Transaction', TransactionSchema)
export { TransactionModel }
