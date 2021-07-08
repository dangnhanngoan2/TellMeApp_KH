import { api } from './api'

export const apiService = {
  getServices: () => {
    return api.get('services')
  },

  getAllServices: () => {
    return api.get('all-service')
  }
}
