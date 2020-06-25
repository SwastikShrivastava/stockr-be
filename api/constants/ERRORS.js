'use strict'

export const ERRORS = {
  USER_NOT_FOUND: [404, 'User not found'],
  OFFICE_NOT_FOUND: [404, 'Office not found'],
  RIDE_NOT_FOUND: [404, 'User does not have any ride to offer currently'],
  RIDE_EXPIRED: [400, 'Offered ride is already expired'],
  INSUFFICIENT_INPUT: [400, 'All required params not provided'],
  INVALID_CREDENTIALS: [401, 'Invalid credentials'],
  USER_UNAUTHENTICATED: [401, 'SESSION EXPIRED, PLEASE LOGIN AGAIN'],
  SOMETHING_WENT_WRONG: [500, 'Opps! Something went wrong'],
  INVALID_CRED: [400, 'Invalid credentials'],
  VERIFICATION_ERROR: [401, 'You are unauthorised'],
  LOW_BALANCE: [401, 'You\'re balance is low'],
  INVALID_INPUT: [400, 'Invalid input. Please provide employeeID']
}
