import React from 'react'
import { Text as ReactText, StyleSheet, Platform } from 'react-native'
import { Colors } from 'tell-me-common'

export const Text = ({ style, ...props }) => {
  return (
    <ReactText style={[styles.text, style]} {...props}>{props.children}</ReactText>
  )
}

const styles = StyleSheet.create({
  text: {
    color: Colors.BLACK,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'AvenirNextRegular'
  }
})
