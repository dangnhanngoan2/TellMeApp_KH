import React from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Colors } from 'tell-me-common'
import { Text } from './text'

const { width, height } = Dimensions.get('window')

export const Line = ({ content, lineWidth = 0.85 * width, color = Colors.BLACK }) => {
  return <View style={[styles.container, { width: lineWidth }]}>
    <View style={{ flex: 1, height: 1, backgroundColor: color }} />
    <Text style={{ color, marginHorizontal: 10 }}>{content}</Text>
    <View style={{ flex: 1, height: 1, backgroundColor: color }} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35 * height / 667
  }
})
