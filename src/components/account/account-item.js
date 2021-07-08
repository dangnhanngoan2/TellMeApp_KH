import React from 'react'
import { View, Dimensions } from 'react-native'
import { Colors } from 'tell-me-common'
import { TouchableOpacity } from '../common/touchable'
import { Icon } from '../common/icon'
import { Text } from '../common/text'

const { width } = Dimensions.get('window');

export const AccountItem = ({ onPress, iconName, size, title, hasNotIcon, right }) => {
  return <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.leftContainer}>
        {!hasNotIcon && <Icon name={iconName} color={Colors.GREYISH_BROWN} style={{ marginRight: 15,}} size={size} />}
        <Text>{title}</Text>
      </View>
     { right ? right : <Icon color={Colors.GREYISH_BROWN} size={24} name={'right'}/>}
  </TouchableOpacity>
}

const styles = {
  container: {
    backgroundColor: Colors.WHITE,
    width: 0.9 * width,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
    borderBottomWidth: 0.5,
    borderColor: '#eaeaea'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}
