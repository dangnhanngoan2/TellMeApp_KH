import React from 'react'
import {
  StyleSheet
} from 'react-native'
import { Colors } from 'tell-me-common'
import { CheckBox, Icon } from 'react-native-elements'

export const CheckBoxText = ({ title, onCheck, checked, style }) => {
  return <CheckBox
    checkedIcon={<Icon size={24} color={Colors.GREEN} type='material-community' name='checkbox-blank-circle-outline' />}
    uncheckedIcon={<Icon size={24} color={Colors.GREEN} type='material-community' name='circle-slice-8' />}
    containerStyle={[styles.checkboxContainer, style]}
    title={title}
    checked={checked}
    onPress={onCheck}
  />
}

const styles = StyleSheet.create({
  checkboxContainer: {
    backgroundColor: Colors.WHITE,
    borderWidth: 0,
    padding: 0
  }
})
