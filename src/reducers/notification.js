import Types from '../actions/types'

const INITIAL_STATE = 0

export const notification = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.SET_BADGE:
            return action.badge
        default:
            return state
    }
}
