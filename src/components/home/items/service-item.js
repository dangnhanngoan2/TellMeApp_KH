import React from 'react'
import { TouchableOpacity, View, Dimensions } from 'react-native'
import { Text } from '../../common/text'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

export const ServiceItem = ({ item, onPress, isCheck }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={() => {
      onPress(item, !isCheck, item.id)
    }}>
      <View style={[styles.container]}>
        <FastImage
          resizeMode='contain'
          style={{ width: '100%', height: '100%' }}
          source={isCheck ? item.srcCheck : item.srcUnCheck} />
      </View>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  )
}

const styles = {
  buttonContainer: {
    alignItems: 'center',
    width: 0.25 * width * 0.9
  },
  container: {
    width: 65 * width / 375,
    height: 65 * width / 375,
    borderRadius: 32.5 * width / 375,
    alignItems: 'center',
    justifyContent: 'center'
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 3.84,

    // elevation: 5,
    // backgroundColor: Colors.WHITE,
  },
  text: {
    fontSize: 14,
    marginTop: 10
  }
}
