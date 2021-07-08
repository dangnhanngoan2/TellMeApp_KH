import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { Colors } from 'tell-me-common'
import { BorderlessButton } from 'react-native-gesture-handler'

export const HeaderLabel = ({ onPress, label, primary }) => {
  return (
    <BorderlessButton onPress={onPress} style={styles.container}>
      <Text
        style={[
          styles.text,
          { color: primary ? Colors.YELLOW_DARK : Colors.WHITE }
        ]}
      >
        {label}
      </Text>
    </BorderlessButton>
  )
}

HeaderLabel.defaultProps = {
  label: 'Done',
  primary: false
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    padding: 8
  },
  text: {
    color: Colors.WHITE
  }
})
