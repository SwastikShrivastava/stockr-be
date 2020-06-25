'use strict'

export const asyncWrapper = (fn) => (request, response, next) =>
  Promise.resolve(fn(request, response, next))
    .catch(next)
