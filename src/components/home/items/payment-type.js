import React, { useState } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import { SurPlus } from './surplus'
import { TouchableOpacity } from '../../../components/common/touchable'
import { Icon as IconCommon } from '../../common/icon'
import { Colors, I18n } from 'tell-me-common'

const { height } = Dimensions.get('window');

export const PaymentType = ({ isHeart, title, onPress, amount, isChoose, style, isPick }) => {
  let textStyle = {};
  if (isPick) {
    textStyle = { color: Colors.WHITE, fontSize: 14 };
  } else {
    textStyle = { color: isChoose ? Colors.WHITE : Colors.NOBEL, fontSize: 14 };
  }
  return (
    <TouchableOpacity onPress={() => {
      console.log('tai sao lai nhu the')
      onPress()
    }} style={[styles.container, { backgroundColor: isChoose ? Colors.GREEN : Colors.AQUA }, style]}>
      <View style={[styles.checkContainer, { position: 'absolute', left: 10 }]}>
        {isHeart ?
          <IconCommon
            style={styles.icon}
            color={Colors.RED}
            size={18} name='heart' /> :
          <IconCommon
            style={styles.icon}
            color={isChoose ? Colors.AQUA : Colors.GREEN}
            size={15} name='money' />
        }
        <Text style={textStyle}>{title}</Text>

      </View>
      <View style={[styles.checkContainer, { width: '100%'}]}>
        {isHeart ? <SurPlus textStyle={[textStyle, { fontSize: 15, fontWeight: '600' }]} size={16} content={amount} /> : <Text style={[textStyle, { fontSize: 15, fontWeight: '600' }]}>{amount}K</Text>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 45 * height / 667,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
    // position: 'absolute',
    // left: 10
  },
  icon: { marginTop: 3, marginRight: 5 }
})
