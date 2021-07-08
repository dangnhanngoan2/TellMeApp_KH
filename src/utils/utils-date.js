import {
  Platform,
  NativeModules,
  NativeEventEmitter,
  DatePickerAndroid,
  processColor
} from 'react-native'
import { Colors } from 'tell-me-common'

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss'

function pickDateTimeIOS (format: string = DEFAULT_FORMAT): Promise {
  const { RNKitASDatePicker } = NativeModules

  const nativeEventEmitter = new NativeEventEmitter(RNKitASDatePicker)
  let listener = null

  const extraArgs = {
    dayText: 'd',
    monthText: 'm',
    yearText: '',
    hoursText: 'h',
    minutesText: 'm',
    secondsText: 's'
  }

  const datePickerDefaultArgs = {
    titleText: 'Date',
    titleTextColor: '#393939',
    doneText: 'Done',
    doneTextColor: Colors.VIOLET,
    cancelText: 'Cancel',
    cancelTextColor: Colors.VIOLET,
    datePickerMode: 'date'
  }
  const options = { ...extraArgs, ...datePickerDefaultArgs }
  const params = {
    ...options,
    titleTextColor: processColor(options.titleTextColor),
    doneTextColor: processColor(options.doneTextColor),
    cancelTextColor: processColor(options.cancelTextColor),
    wheelBgColor: processColor(options.wheelBgColor),
    titleBgColor: processColor(options.titleBgColor),
    outTextColor: processColor(options.outTextColor),
    centerTextColor: processColor(options.centerTextColor),
    dividerColor: processColor(options.dividerColor),
    shadeBgColor: processColor(options.shadeBgColor)
  }

  return new Promise((resolve, reject) => {
    try {
      RNKitASDatePicker.showWithArgs(params, resp => {
        if (resp.type === 'done') {
          options.onPickerConfirm && options.onPickerConfirm(resp.selectedDate)
          return resolve(resp.selectedDate)
        } else {
          options.onPickerCancel && options.onPickerCancel()
          return reject(new Error(null))
        }
      })
      listener && listener.remove()
      listener = nativeEventEmitter.addListener('DatePickerEvent', event => {
        options.onPickerDidSelect &&
          options.onPickerDidSelect(event.selectedDate)
        // resolve(event.selectedDate)
      })
    } catch (e) {
      listener && listener.remove()
      options.onPickerCancel && options.onPickerCancel()
      return reject(new Error(null))
    }
  })
}

async function pickDateTimeAndroid () {
  try {
    const { action, year, month, day } = await DatePickerAndroid.open({
      // Use `new Date()` for current date.
      // May 25 2020. Month 0 is January.
      date: new Date(2018, 4, 25)
    })
    if (action !== DatePickerAndroid.dismissedAction) {
      let monthDate = null
      let dayDate = null
      if (month < 9) {
        monthDate = '0' + (month + 1)
      } else {
        monthDate = month
      }
      if (day < 10) {
        dayDate = '0' + day
      } else {
        dayDate = day
      }
      // Selected year, month (0-11), day
      return year + '-' + monthDate + '-' + dayDate
    }
  } catch ({ code, message }) {
    console.warn('Cannot open date picker', message)
  }
}

export function pickDateTime () {
  return Platform.OS === 'ios' ? pickDateTimeIOS() : pickDateTimeAndroid()
}
