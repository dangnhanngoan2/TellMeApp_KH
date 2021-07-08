'use strict'

import { auth } from './auth'
import { config } from './config'
import { user } from './user'
import { notification } from './notification'

export const rootReducer = {
  auth,
  config,
  user,
  notification
}
