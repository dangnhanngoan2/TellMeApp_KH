import Types from './types'

export function updateAuthData (auth: Object, username: string) {
  return {
    type: Types.UPDATE_AUTH_DATA,
    auth,
    username
  }
}

export function updatedAuth (auth: Object) {
  return {
    type: Types.UPDATED_AUTH,
    auth
  }
}


export function clearAuth () {
  return {
    type: Types.CLEAR_USER_DATA
  }
}

