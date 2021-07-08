import { api } from './api'

export const apiFeedback = {
  createFeedback: (content) => {
    return api.post(`rates`, { content, type: 0 })
  },

  createRate: (params) => {
    //{"book_id":1,"content":"test merge rate - sroce","score":4.0,"type":1}
    return api.post(`rates`, { ...params })
  }
}
