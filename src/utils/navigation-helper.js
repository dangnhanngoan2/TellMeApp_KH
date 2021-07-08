import { DeviceEventEmitter } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
export let MainAppNavigator = null

export function resetNavigate(routeName, context) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName })],
  });
  context.props.navigation.dispatch(resetAction);
}

export function toggleDrawer(isOpen: true) {
  DeviceEventEmitter.emit('DRAWER_TOGGLE', isOpen)
}

export function setAppNavigator(nav) {
  MainAppNavigator = nav
}
