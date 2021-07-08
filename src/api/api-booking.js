import { api } from './api'

export const apiBooking = {

  loadStaffForBook: (data) => {
    //{"service_id":"1","gender":true,"time":"2","address":"ha noi pho","lat":"1111",'long":"11111"}
    return api.post('load-staff-for-book', { ...data })
  },

  createBook: (data) => {
    return api.post('books', { ...data })
  },

  updateBook: (book_id, data) => {
    return api.put(`books/${book_id}`, { ...data })
  },

  getBookHistory: (page) => {
    return api.post(`books-by-wallet?page=${page}`, { status: 0 })
  },
  

  loadStaffSingleConversation: (data) => {
    return api.post(`load-staff-single-conversation`, {...data })
  },

  getListStaff: (type, latitude, longitude, sex, search) => {
    return api.get(`list-staff?type=${type}&latitude=${latitude}&longitude=${longitude}&sex=${sex}&search=${search}`)
  },

  createBookSchedule: (data) => {
    return api.post('book-schedule', { ...data })
  },


  // START API NEW VER2
  createBookScheduleChatting: (data) => {
    return api.post('book-staff-schedule', { ...data })
  },

  postHeart: (staff_id) => {
    return api.post('give-heart', { staff_id })
  },

  
  checkExitConversation: (data) => {
    return api.post('check-exists-single-conversation', { ...data })
  },

  createConversation: (data) => {
    return api.post('single-conversations', { ...data })
  },

  //END


  getBookProcess: () => {
    //get-book-process
    return api.get('get-book-process')
  },

  cancelBook: (book_id, reason) => {
    return api.post('cancel-book', { book_id, reason })
  },

  ///cancel-book-now
  cancelBookNow: (book_id) => {
    return api.post('cancel-book-now', { book_id })
  },

  bookAfterFifteenMinute: (book_id) => {
    return api.post('book-after-fifteen-minute', { book_id })
  },

  calculateBook: (service_id, method, staffs, hour) => {
    return api.post('calculate-book', { service_id, method, staffs, hour })
  },

  ///book-renewal
  renewalBook: (book_id, method, hour) => {
    return api.post('book-renewal', { book_id, method, hour })
  },

  ///book-detail
  getBookDetail: (book_id) => {
    return api.get('book-detail', { book_id })
  },

  hideBooking: (book_id) => {
    return api.get(`hide-book/${book_id}`)
  },

  
  totalUnreadConversation: () => {
    return api.get(`total-unread-conversation`)
  },

  finishSoon: (book_id) => {
    return api.get(`update-book/${book_id}`)
  },

  serviceByStaff: (book_id) => {
    //{{url_vnm}}/service-by-staff
    return api.post(`service-by-staff`, { book_id })
  },

  getStaffInBook: (book_id) => {
    //{{url_vnm}}/service-by-staff
    return api.post(`get-staff-in-book`, { book_id })
  },



  //load-staff-for-book-interest
  loadStaffForBookInterest: (
    service_id,
    staff_ids,
    latitude,
    longitude,
    address,) => {
    return api.post(`load-staff-for-book-interest`, {
      service_id,
      staff_ids,
      latitude,
      longitude,
      address,
    })
  }
}
