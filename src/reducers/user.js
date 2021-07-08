import Types from '../actions/types'

const INITIAL_STATE = null

export const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SAVE_AMOUNT:
      return {
        amount: action.amount
      }
    default:
      return state
  }
}
