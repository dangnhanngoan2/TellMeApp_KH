import { api } from './api'

export const apiStaff = {
  getStaffs: (latitude, longitude) => {
    return api.post('staffs-near', { latitude, longitude })
  },

  bookStaff: (params) => {
    // params for book staff: { book_id: String, start_time: String, end_time: String, address: String, service_id: Int, staffs: [], wallet_id: int, renewal: int}
    return api.post('books', params)
  },

  staffsNear: (params) => {
    //staffs-near
    console.log('location: , location', params)
    return api.post('staffs-near', params)
  }
}
