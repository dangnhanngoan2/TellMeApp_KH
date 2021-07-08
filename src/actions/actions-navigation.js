import { StackActions, NavigationActions } from 'react-navigation'

export function navigate(screenName, params) {
  return NavigationActions.navigate({
    routeName: screenName,
    params
  })
}

export function push(routeName, params, action) {
  return StackActions.push({
    routeName,
    params,
    action
  })
}

export function resetToTab(routeName: string) {
  return StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'TabNavigator',
        action: NavigationActions.navigate({ routeName })
      })
    ]
  })
}

export function goBack(screenKey) {
  return StackActions.pop(screenKey)
}

export function popToTop() {
  return StackActions.popToTop()
}
