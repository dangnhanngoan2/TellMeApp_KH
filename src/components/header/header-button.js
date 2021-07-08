import React from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { Colors } from 'tell-me-common'
import { BorderlessButton } from 'react-native-gesture-handler'
import { Icon } from '../common/icon'

const { width } = Dimensions.get('window')

export const HeaderButton = ({ onPress, blank, name, badgeCount, size, color, text }) => {
  console.log('texttexttext: ', text)
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {blank ? (
        <View style={styles.blank} />
      ) : (
        <Icon style={{ padding: 0 }} size={size} name={name} color={color || Colors.WHITE} />
      )}
      {badgeCount > 0 && (
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeCount}>{badgeCount}</Text>
        </View>
      )}
      {text && <Text numberOfLines={1} style={{ fontSize: 15, color, fontWeight: '600', marginLeft: 5 }}>{text}</Text>}
    </TouchableOpacity>
  )
}

HeaderButton.defaultProps = {
  name: 'menu'
}

const BADGE_SIZE = 12

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingVertical: 5,
    // marginHorizontal: 6,
    // padding: 5,
    // borderColor: 'blue',
    // borderWidth: 1
  },
  blank: {
    width: 42
  },
  badgeWrapper: {
    position: 'absolute',
    left: 17,
    top: 4,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    backgroundColor: Colors.RED,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BADGE_SIZE / 2
  },
  badgeCount: {
    fontSize: 8,
    color: Colors.WHITE
  }
})
