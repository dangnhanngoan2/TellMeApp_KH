import { api } from './api'

export const apiBankInfo = {
    getBankInfo: () => {
    return api.get(`admin-banks`)
    },

    customerPayment: (params)=> {
        //bank_name, bank_branch, bank_owner, bank_account
        return api.post(`customer-payments`, params)
    }
}