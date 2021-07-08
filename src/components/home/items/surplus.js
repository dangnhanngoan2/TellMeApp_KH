import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from '../../common/icon'
import { Text } from '../../common/text'
import { Colors } from 'tell-me-common'

// heart
export const SurPlus = ({ content, size, textStyle, navigation, noEventAmount, updateAmount }) => {
  return (
    <TouchableOpacity onPress={() => {
      updateAmount && updateAmount();
      if (navigation && !noEventAmount)
        navigation.navigate('Wallet')
    }} style={styles.container}>
      <Text style={[styles.text, textStyle]}>{content}</Text>
      <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>
      {/* <Icon color={Colors.RED} size={size || 24} name='heart' /> */}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginRight: 4,
    fontWeight: '700'
  },

  commonText: {
    fontWeight: '700'
  }
})
