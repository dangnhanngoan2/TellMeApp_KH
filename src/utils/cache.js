import { AsyncStorage } from 'react-native'

let ids = null
let unreviewedTransactions = []

export const Keys = {
  COOKIE: 'COOKIE'
}

let Cache = storage => {
  return {
    get: async key => {
      try {
        let value = await storage.getItem(key)
        return value ? JSON.parse(value) : null
      } catch (error) {
        console.log(error)
      }
    },
    set: async (key, value) => {
      if (value == null) {
        await storage.removeItem(key)
      } else {
        try {
          await storage.setItem(key, JSON.stringify(value))
        } catch (error) {
          console.log(error)
        }
      }
    },

    /**
     * Get current user data, without having to
     * connect the component to Redux.
     */
    getCurrentUser: () => store.getState().user,

    /**
     * Cache current push notification ids from OneSignal.
     */
    setIds: (data: Object) => {
      console.log(data)
      ids = data
    },

    /**
     * Get the one above.
     */
    getIds: () => ids,

    /**
     * Cache the unreviewed transactions got from apiReview.checkReviewed()
     */
    cacheUnreviewedTransactions: (data: Array<Object>) => {
      unreviewedTransactions = data
    },

    getUnreviewedTransactions: (): Array => unreviewedTransactions
  }
}

export const cache = Cache(AsyncStorage)
