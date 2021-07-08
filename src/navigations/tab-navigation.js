import React from 'react'
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Colors, I18n } from 'tell-me-common'
import { Home } from '../screens/home-tab/home'
import { OrderHistory } from '../screens/activity-tab/order-history'
import { Payments } from '../screens/payment/payments'
import { Messages } from '../screens/message/messages'
import { Account } from '../screens/account/account'
import { OrderEmployee } from '../screens/home-tab/order-employee'
import { MessageTabIcon } from '../components/message/message-tab'
import { Exchange } from '../screens/exchange/exchange';

const stackNavigatorConfig = {
  initialRouteName: 'Home',
  mode: 'card',
  headerMode: 'screen',
  defaultNavigationOptions: ({ navigation }) => {
    return {
      header: null,
      gesturesEnabled: false
    }
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    News: {
      screen: createStackNavigator({ Home, OrderEmployee }, stackNavigatorConfig),
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.new')
      })
    },
    Actions: {
      screen: OrderHistory,
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.action')
      })
    },
    Payment: {
      screen: Payments,
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.payment')
      })
    },
    Messages: {
      screen: Messages,
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.messages')
      })
    },
    Exchange: {
      screen: Exchange,
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.exchange')
      })
    },
    Account: {
      screen: Account,
      navigationOptions: () => ({
        tabBarLabel: I18n.t('navigation.account')
      })
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarOnPress: (tab) => {
        const { routeName } = tab.navigation.state;
        tab.navigation.navigate(routeName, { isPlanning: false })
      },
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'News') {
          iconName = 'home'
          return <MaterialIcons name={iconName} size={25} color={tintColor} />
        } else if (routeName === 'Actions') {
          iconName = `chart-bar`
          return <MaterialIcons name={'description'} size={25} color={tintColor} />
        } else if (routeName === 'Payment') {
          return <Ionicons name={'ios-wallet'} size={25} color={tintColor} />
        } else if (routeName === 'Messages') {
          return <MessageTabIcon tintColor={tintColor} />
        }  else if (routeName === 'Exchange') {
          return <FontAwesome name={'exchange'} size={25} color={tintColor} />
        }else if (routeName === 'Account') {
          iconName = `person`
          return <MaterialIcons name={iconName} size={25} color={tintColor} />
        }
      }
    }),
    mode: 'card',
    headerMode: 'screen',
    tabBarOptions: {
      style: {
        elevation: 5,
        backgroundColor: Colors.WHITE
      },
      activeTintColor: Colors.GREEN,
      inactiveTintColor: '#696969'
    },
    navigationOptions: {
      header: null
    }
  })

export default TabNavigator
