import { api } from './api'

export const apiProfile = {
  getProfile: (id) => {
    return api.get(`users/${id}`)
  },
 
  updateProfile: (params) =>{
    return api.postFormData(`update-user`, {...params  , type_id:3})
  },

  updateToPartner: ()=> {
    return api.post('update-up-to-partner')
  }
}
