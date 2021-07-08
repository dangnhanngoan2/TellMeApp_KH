import { api } from './api'

export const apiSetting = {
  getSetting: () => {
    return api.get('setting/get-setting')
  },

  createSalary: (data) => {
    return api.post('salary/create-salary', { ...data })
  },

  getLink: () => {
    return api.get('link-web')
  }
}
