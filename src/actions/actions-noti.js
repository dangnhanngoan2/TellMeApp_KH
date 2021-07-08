import Types from './types'

export function updateBadge(badge) {
    return {
        type: Types.SET_BADGE,
        badge
    }
}
