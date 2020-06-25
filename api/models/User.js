'use strict'

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String },
  password: { type: String },

  amount: { type: Number }
}, { timestamps: true })

UserSchema.index({ username: 1 }, { unique: true })

const UserModel = mongoose.model('User', UserSchema)
export { UserModel }
