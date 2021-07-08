import { DeviceEventEmitter } from 'react-native'
import { StaticData } from '../common/static-data'

export function setLoading (isLoading: Boolean = true) {
  DeviceEventEmitter.emit(StaticData.EVENT_SET_LOADING_OVERLAY, isLoading)
}
