import { api } from './api'

export const apiNotification = {
  getNotifications: (page) => {
    return api.get(`admin-notifications?page=${page}`)
  },

  readUpdateNoti: (id) => {
    return api.get(`admin-notifications/${id}`)
  },

  unreadAdminNoti: () => {
    return api.get(`unread-admin-notifications`)
  }
}
