import { api } from './api'

export const apiWallet = {
  getWalletDetail: () => {
    return api.get('wallets')
  }
}
