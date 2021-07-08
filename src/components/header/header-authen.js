import React from 'react'
import { Header as HeaderElement } from 'react-native-elements'
import { StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native'
import { HeaderButton } from './header-button'
import { SurPlus } from '../home/items/surplus'
import { Colors } from 'tell-me-common'
const { width } = Dimensions.get('window')

const Header = ({
  surPlus,
  navigation,
  backgroundColor,
  backFunction,
  isNotification,
  title
}) => {
  return <HeaderElement
    statusBarProps={{ translucent: true, backgroundColor: Colors.GREEN }}
    barStyle={'dark-content'}
    containerStyle={[styles.header, { backgroundColor: backgroundColor || Colors.WHITE }]}
    leftComponent={
      <HeaderButton
        onPress={() => backFunction ? backFunction() : navigation.goBack()}
        name={'left'}
        size={26}
        color={Colors.BLACK}
        text={title}
      />}
    centerContainerStyle={{ flex: 0 }}
    rightContainerStyle={{ flex: 0 }}
    leftContainerStyle={{ flex: 1 }}
    rightComponent={<HeaderButton blank />}
  />
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 0.02 * width,
    borderBottomWidth: 0,
    justifyContent: 'space-between'
  }
})

export { Header }
