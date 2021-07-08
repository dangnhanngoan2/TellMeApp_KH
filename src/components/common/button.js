import React from 'react'
import { StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Colors } from 'tell-me-common'
import { Text } from './text'

export const Button = ({ title, width, onPress }) => {
  return (
    <RectButton onPress={onPress} style={[styles.container, { width }]}>
      <Text style={styles.title}>{title}</Text>
    </RectButton>
  )
}

Button.defaultProps = {
  width: '100%'
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: Colors.YELLOW_DARK
  },
  title: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16
  }
})
