import { takeLatest, all } from 'redux-saga/effects'
import Types from '../actions/types'
import { requestUpdateAuth } from './auth-saga'

export function * rootSaga () {
  yield all([takeLatest(Types.UPDATE_AUTH_DATA, requestUpdateAuth)])
}
