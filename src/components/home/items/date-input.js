/**
 * @flow
 */

'use strict'

import React, { PureComponent } from 'react'
import {
  TextInput,
  DeviceEventEmitter,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { Icon } from 'react-native-elements'
import { Colors, I18n } from 'tell-me-common'
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import { StaticData } from '../../../common/static-data'
import ModalController from '../../modal-controller/modal-controller'

class DateInput extends PureComponent {

  constructor(props) {
    super(props);
    this.startTime = moment().add(5, 'minute').startOf('minute').toDate();
    this.state = {
      date: this.startTime,
      range: props.order.hour
    }
  }

  componentDidMount() {
    DeviceEventEmitter.addListener(StaticData.CHANGE_START_TIME, range => {
      this.setState({ range })
    })
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(StaticData.CHANGE_START_TIME)
  }

  onDatePicker = () => {
    Keyboard.dismiss();
    ModalController.show(<DatePicker
      date={this.state.date}
      mode={'datetime'}
      format="HH:mm"
      locale="vi"
      minimumDate={this.startTime}
      onDateChange={date => {
        if (moment(date).valueOf() < moment().add(5, 'minute').startOf('minute').valueOf()) {
          return Alert.alert(I18n.t('home.alert_faile.title'),
            I18n.t('home.plan.alert_time'))
        }
        console.log('date: ', date)
        this.setState({ date: date });
        this.props.setItem(date, 'start_time')
      }}
    />, 100, 'bottom')
  }

  render() {
    const { date, range } = this.state;
    const timeString = `${moment(date).format('HH:mm')} - ${moment(date).add(range.value, 'hour').format('HH:mm')} ${moment(date).format('DD/MM/YYYY')}`
    return (
      <TouchableOpacity onPress={this.onDatePicker} style={[styles.inputWrapper]}>
        <TextInput
          onTouchStart={this.onDatePicker}
          autoCapitalize={'words'}
          blurOnSubmit
          maxLength={50}
          editable={false}
          value={timeString}
          underlineColorAndroid={'transparent'}
          style={[styles.input]}
        />

        <Icon
          type={'material-community'}
          name='calendar-range'
          size={22}
          color={Colors.GREEN}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginBottom: 5,
    borderRadius: 4,
    alignSelf: 'stretch',
    borderColor: Colors.BLACK,
    borderWidth: 0.5
  },
  input: {
    height: 35,
    paddingHorizontal: 8,
    flexGrow: 1,
    fontSize: 12,
    marginLeft: 4,
    alignSelf: 'stretch',
    color: Colors.BLACK
  }
})

export { DateInput }
