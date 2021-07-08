import React from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { Colors } from 'tell-me-common'
import { Icon } from '../common/icon'
import { Text } from '../common/text'

const { width } = Dimensions.get('window');

export const WalletItem = ({ onPress, item }) => {
  return <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.textTitle}>{item.time}</Text>
        <Text style={styles.text}>{item.content}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text 
        style={{ color: item.receive == 0 ? Colors.RED : Colors.GREEN}}>
        {item.amount}{!item.isHeart && 'K'}
        </Text>
      {item.isHeart && <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>}
      </View>
  </TouchableOpacity>
}

const styles = {
  container: {
    backgroundColor: Colors.WHITE,
    width: 0.9 * width,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eaeaea'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    paddingVertical: 3,
    fontSize: 13
  },
  textTitle: {
    fontSize: 12,
    marginLeft: 2,
    paddingVertical: 3,
    color: Colors.LIGHT_GREY
  },
  commonText: {
    fontWeight: '600',
    marginLeft: 3,
  }
}
