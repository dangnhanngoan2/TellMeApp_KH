import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, View, Dimensions, DeviceEventEmitter } from 'react-native'
import { Text } from '../common/text'
import { hoursExtention, StaticData } from '../../common/static-data'
import { Colors,I18n } from 'tell-me-common'
const { height, width } = Dimensions.get('window')

export class ChooseHoursExtention extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hour: hoursExtention[0],
      disableforOneHour: false
    }
  }

  onPress = (item) => {
    this.props.setItem(item)
    this.setState({ hour: item })
  }

  render () {
    const { noTitle, styleContainer } = this.props
    const { hour } = this.state
    return (
      <View style={[styles.container, styleContainer]}>
        {!noTitle && <Text style={styles.title}>{I18n.t('home.choose_hour')}</Text>}
        <View style={styles.containerHours}>
          {hoursExtention.map(value => {
            const check = value.id === hour.id
            return <TouchableOpacity
              key={value.id} onPress={() => this.onPress(value)} 
              style={[styles.hour, { backgroundColor: check ? Colors.GREEN : Colors.WHITE, borderColor: Colors.GREEN }]}>
              <Text style={[styles.contentHour, { color: check ? Colors.WHITE : Colors.GREEN }]}>{value.name}</Text>
            </TouchableOpacity>
          })}
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20
  },
  title: {
    fontWeight: '600',
    marginBottom: 10
  },
  hour: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 28,
    borderColor: Colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 15,
    width: 0.17 * width
  },
  contentHour: {
    fontSize: 12,
    color: Colors.BLACK
  },
  containerHours: {
    marginVertical: 5,
    width: 0.9 * width,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})
