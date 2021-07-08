import Types from './types'

export function saveUserData (user: Object) {
  return {
    type: Types.SAVE_USER_DATA,
    user
  }
}

export function refreshProfile () {
  return {
    type: Types.REFRESH_PROFILE
  }
}

export function clearUserData () {
  return {
    type: Types.CLEAR_USER_DATA
  }
}

export function setCurrentLocation (currentLocation) {
  return {
    type: Types.SAVE_CURRENT_LOCATION,
    currentLocation
  }
}

export function saveAmount (amount) {
  return {
    type: Types.SAVE_AMOUNT,
    amount
  }
}


export function updateAmount (amount) {
  return {
    type: Types.UPDATED_AUTH_X,
    user
  }
}

