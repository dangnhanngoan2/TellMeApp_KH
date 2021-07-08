import { call, select, put } from 'redux-saga/effects'
// import { apiAuth } from '../api/api-auth'
import { apiNotification } from '../api/api-notification'
import { setAccessToken } from '../api/api'
import { updatedAuth } from '../actions/actions-auth'
import { saveUserData } from '../actions/actions-user'
import { updateBadge } from '../actions/actions-noti'
import { setLoading } from '../modules/progress-hud'

export function* requestUpdateAuth(action) {
  try {
    const state = yield select()
    const { auth } = state

    // Check if auth data exist. If yes refresh the auth data.
    if (auth) {
      yield put(updatedAuth(auth))
      setAccessToken(auth.token)
      setLoading(false)
      const resultUnread = yield call(apiNotification.unreadAdminNoti);
      console.log('resultUnread: ', resultUnread);
      if (resultUnread.status === 'success') {
        const { total } = resultUnread.data;
        yield put(updateBadge(total))
      }
    } else {
      // Otherwise, get the auth data from the action (new app installed).
      const { auth } = action
      if (auth) {
        yield put(updatedAuth(auth))
        yield put(saveUserData(auth.user))
        setAccessToken(auth.token)
        setLoading(false)
        const resultUnread = yield call(apiNotification.unreadAdminNoti);
        console.log('resultUnread: ', resultUnread);
        if (resultUnread.status === 'success') {
          const { total } = resultUnread.data;
          yield put(updateBadge(total))
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}
