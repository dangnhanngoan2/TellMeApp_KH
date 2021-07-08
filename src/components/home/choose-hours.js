import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native'
import { Text } from '../common/text'
import { hours } from '../../common/static-data'
import { Colors, I18n } from 'tell-me-common'
const { width } = Dimensions.get('window')

export class ChooseHours extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      disableforOneHour: false
    }
  }

  onPress = (item) => {
    this.props.setItem(item, 'hour')
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    if (nextProps.service
      && nextProps.service.id === 1
      && this.props.service
      && nextProps.service.id !== this.props.service.id) {
      return this.setState({ disableforOneHour: false })
    }

    if (nextProps.service
      && nextProps.service.id !== 1 && 
      (!this.props.service || this.props.service
        && this.props.service.id === 1)) {
      return this.setState({ disableforOneHour: true })
    }
  }

  render() {
    const { noTitle, styleContainer, hour } = this.props
    const { disableforOneHour } = this.state
    return (
      <View style={[styles.container, styleContainer]}>
        {!noTitle && <Text style={styles.title}>{I18n.t('home.choose_hour')}</Text>}
        <View style={styles.containerHours}>
          {hours.map(value => {
            const check = hour ? value.id === hour.id : false
            return <TouchableOpacity disabled={disableforOneHour && value.id === 1}
              key={value.id} onPress={() => this.onPress(value)}
              style={[styles.hour, {
                backgroundColor: disableforOneHour && value.id === 1 ? Colors.WHISPER
                  : (check ? Colors.GREEN : Colors.WHITE), borderColor: Colors.GREEN
              }]}>
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
    height: 30,
    borderColor: Colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 15,
    width: 0.2 * width
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
