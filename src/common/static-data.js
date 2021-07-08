import Colors from './colors'
import { I18n } from 'tell-me-common'

export const StaticData = {
  EVENT_DRAWER_TOGGLE: 'DRAWER_TOGGLE',
  EVENT_SET_LOADING_OVERLAY: 'EVENT_SET_LOADING_OVERLAY',
  UPDATE_DEFAULT_HOUR: 'UPDATE_DEFAULT_HOUR',
  CHANGE_START_TIME: 'CHANGE_START_TIME',
  UPDATE_ACTIONS: 'UPDATE_ACTIONS',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE'
}

export const NotificationType = {
  STATUS_PROCESS_INTEREST: 'STATUS_PROCESS_INTEREST',
  BOOK_NOW_NEW: 'STATUS_LOADING',
  BOOK_NOW_PROCESS: 'STATUS_PROCESS',
  STATUS_SCHEDULE: 'STATUS_SCHEDULE',
  STAFF_CONFIRM_SCHEDULE: 'STAFF_CONFIRM_SCHEDULE',
  STATUS_START_MEET: 'STATUS_START_MEET',
  STATUS_COMPLETE: 'STATUS_COMPLETE',
  STATUS_CANCEL: 'STATUS_CANCEL',
  STAFF_ARRIVE: 'STAFF_ARRIVE',
  BEFORE_COMPLETE: 'STATUS_BEFORE_COMPLETE',
  STATUS_BOOK_TIME_OUT: 'STATUS_BOOK_TIME_OUT',
  STATUS_STAFF_OUT: 'STATUS_STAFF_OUT',
  STATUS_REFUND: 'STATUS_REFUND',
  STATUS_NEW_MESSAGE: 'STATUS_NEW_MESSAGE',
  ADMIN_NOTIFICATION: 'ADMIN_NOTIFICATION'
}

export const TypeUser = {
  customer: 3,
  employee: 2
}

export const sexType = {
  1: 'Nữ',
  0: 'Nam'
}

export const serviceHomeOptions = [
  {
    name: 'Cafe',
    id: 1,
    state: false,
    srcUnCheck: require('../assets/home/tea-cup.png'),
    srcCheck: require('../assets/home/tea-cup-1.png')
  },
  {
    name: 'Ẩm thực',
    id: 2,
    state: false,
    srcUnCheck: require('../assets/home/dinner.png'),
    srcCheck: require('../assets/home/dinner-1.png')
  },
  {
    name: 'Tuyển dụng',
    id: 3,
    state: false,
    srcUnCheck: require('../assets/home/recruit.png'),
    srcCheck: require('../assets/home/recruit_active.png')
  },
  {
    name: 'Trợ lý',
    id: 4,
    state: false,
    srcUnCheck: require('../assets/home/beer.png'),
    srcCheck: require('../assets/home/beer-1.png')
  }
]

export const hours = [
  {
    id: 1,
    name: '1 Giờ',
    value: 1
  },
  {
    id: 2,
    name: '2 Giờ',
    value: 2
  },
  {
    id: 3,
    name: '3 Giờ',
    value: 3
  },
  {
    id: 4,
    name: '4 Giờ',
    value: 4
  }
]

export const hoursExtention = [
  {
    id: 1,
    name: '15 Phút',
    value: 0.25
  },
  {
    id: 2,
    name: '30 Phút',
    value: 0.5
  },
  {
    id: 3,
    name: '1 Giờ',
    value: 1
  },
  {
    id: 4,
    name: '2 Giờ',
    value: 2
  },
  {
    id: 5,
    name: '3 Giờ',
    value: 3
  }
]

export const genders = [
  {
    id: 1,
    name: 'Nữ',
    srcCheck: require('../assets/services/female-1.png'),
    srcUnCheck: require('../assets/services/female.png')
  },
  {
    id: 0,
    name: 'Nam',
    srcCheck: require('../assets/services/male-1.png'),
    srcUnCheck: require('../assets/services/male.png')
  }
]

export const images = [
  'https://cdn.pixabay.com/photo/2019/07/30/20/33/flower-4373800_1280.jpg',
  'https://cdn.pixabay.com/photo/2013/07/18/20/26/boat-164989_1280.jpg',
  'https://cdn.pixabay.com/photo/2013/08/20/15/47/sunset-174276_1280.jpg',
  'https://cdn.pixabay.com/photo/2013/04/03/21/25/cereals-100263_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/03/26/09/45/grapes-690230_1280.jpg'
]

//0 là tiền mặt, 1 là wallet

export const paymentMethod = {
  0: 1,
  1: 0
}

export const BookStatus = {
  STATUS_LOADING: -2, // Loading 
  STATUS_NEW: -1, // book new
  STATUS_WAIT: 0, // book schedule when staff accecpt with book
  STATUS_CANCEL: 1, // book cancel
  STATUS_PROCESS: 2, // book now has when 
  STATUS_START_MEET: 3,
  STATUS_RENEWAL: 4,
  STATUS_COMPLETE: 5,
  STATUS_RATE: 6,
  STATUS_CANCEL_RENEWAL: 7,
  STATUS_EDIT: 8,
  STATUS_TMP: 9
}

export const BookScheduleStatus = {
  STATUS_NEW: -1,
  STATUS_WAIT: 0,
  STATUS_CANCEL: 1,
  STATUS_START_MEET: 3,
  STATUS_RENEWAL: 4,
  STATUS_COMPLETE: 5,
  STATUS_RATE: 6,
  STATUS_CANCEL_RENEWAL: 7,
  STATUS_EDIT: 8,
  STATUS_TMP: 9
}


export const BookTextStatus = {
  '-1': I18n.t('actions.action_detail.title.wait_confirm'),
  '-2': I18n.t('actions.action_detail.title.wait_confirm'),
  '5': I18n.t('actions.action_detail.title.used'),
  '3': I18n.t('actions.action_detail.title.happenning'),
  '0': I18n.t('actions.action_detail.title.upcoming'),
  '2': I18n.t('actions.action_detail.title.upcoming'),
  '1': I18n.t('actions.action_detail.title.cancel'),
  '4': I18n.t('actions.action_detail.title.happenning'),
}

export const BookColorStatus = {
  '-1': Colors.BLUE,
  '-2': Colors.BLUE,
  '5': Colors.GREEN,
  '3': Colors.ATLANTIS,
  '0': Colors.ORANGE,
  '2': Colors.ORANGE,
  '1': Colors.RED,
}


const LATITUDE = 21.017835
const LONGITUDE = 105.773749

export const locationNow = {
  formatted_address: ' ',
  location: {
    latitude: LATITUDE,
    longitude: LONGITUDE
  }
}

export const setLocationNow = location => {
  console.log('co vao day ma: ', location)
  locationNow = location;
}

