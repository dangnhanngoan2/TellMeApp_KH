import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'

//authen
import { Login } from '../screens/login'
import { Signup } from '../screens/signup/signup'
import { ConfirmCode } from '../screens/signup/confirm-code'
import { CreatePin } from '../screens/signup/create-pin'
import { ForgotPinCode } from '../screens/forgot-pin-code'
import { UpdatePinCode } from '../screens/update-pin-code'

//home
import TabNavigator from './tab-navigation'
import { Home } from '../screens/home-tab/home'
import { MapViewScreen } from '../screens/home-tab/map-view'
import { TimeExtention } from '../screens/home-tab/time-extention'
import { Review } from '../screens/home-tab/review'
import { OrderByInterests } from '../screens/home-tab/order-by-interests'

//message
import { MessageDetail } from '../screens/message/message-detail'
import { Notifications } from '../screens/notification/notifications'
import { NotiDetails } from '../screens/notification/noti-details'

//account
import { Wallet } from '../screens/account/wallet'
import { Profile } from '../screens/account/profile'
import { TransactionDetail } from '../screens/account/transaction-detail'
import { Setting } from '../screens/account/setting'
import { Guide } from '../screens/account/guide'
import { Feedback } from '../screens/account/feedback'
import { ChangePinCode } from '../screens/account/change-pin-code'
import { ChangeLanguage } from '../screens/account/change-langue'
import { Introduction } from '../screens/account/introduction'
//history
import { OrderDetail } from '../screens/activity-tab/order-detail'
import {CheckPinCode} from '../screens/signup/check-pin-code'
import CameraScreen from '../components/common/camera'

//list user
import {ListStaff} from '../screens/list-staff/list-staff'
import { fromPairs } from 'lodash'
const routeConfig = {
  Login: Login,
  ForgotPinCode,
  UpdatePinCode,
  Signup: Signup,
  News: TabNavigator,
  MapView: MapViewScreen,
  TimeExtention: TimeExtention,
  Notifications,
  NotiDetails,
  Review: Review,
  ConfirmCode: ConfirmCode,
  CreatePin: CreatePin,
  Profile: Profile,
  MessageDetail: MessageDetail,
  Wallet: Wallet,
  TransactionDetail,
  OrderDetail,
  Setting,
  Guide,
  Feedback,
  ChangePinCode,
  ChangeLanguage: ChangeLanguage,
  BookSchedule: Home,
  Introduction,
  OrderByInterests,
  CameraScreen,
  ListStaff
}

const stackNavigatorConfig = {
  initialRouteName: 'Login',
  mode: 'card',
  headerMode: 'screen',
  defaultNavigationOptions: ({ navigation }) => {
    return {
      header: null,
      gesturesEnabled: false
    }
  }
}

const StackNavigator = createStackNavigator(routeConfig, stackNavigatorConfig)

export default createAppContainer(StackNavigator)
