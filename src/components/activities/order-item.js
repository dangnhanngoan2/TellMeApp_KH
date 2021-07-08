import React, { Fragment } from 'react'
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import FastImage from 'react-native-fast-image'
import { Icon } from 'react-native-elements'
import moment from 'moment'
import { imageUrl } from '../../api/api'
import { BookColorStatus, BookStatus } from '../../common/static-data'
import { Text } from '../common/text'

const { width } = Dimensions.get('window')

export const OrderItem = ({ item, goToDetail, reBooking, goToChat, deleteBooking, finishSoon, index }) => {
  const BookTextStatus = {
    '5': I18n.t('actions.text_static.used'),
    '0': I18n.t('actions.text_static.upcoming'),
    '2': I18n.t('actions.text_static.upcoming'),
    '1': I18n.t('actions.text_static.cancel'),
    '4': I18n.t('actions.text_static.process'),
    '3': I18n.t('actions.text_static.process'),
    '-1': I18n.t('actions.text_static.waiting'),
    '-2': I18n.t('actions.text_static.waiting')
  }
  const { service, start_time, staffs, hour, status, end_time } = item;
  console.log('staffs: ', staffs)
  const starTime = moment(start_time).format('HH:mm')
  const endTime = moment(end_time).format('HH:mm')
  const date = moment(end_time).format('DD/MM/YYYY')
  let user_code = null;
  if (staffs.length > 0) {
    user_code = staffs[0].name ? staffs[0].name : staffs[0].code_user;
  }
  const checkReBook = status === BookStatus.STATUS_COMPLETE
    || status === BookStatus.STATUS_CANCEL
    || status === BookStatus.STATUS_RATE;

  const checkCreateConversation = status === BookStatus.STATUS_WAIT
    || status === BookStatus.STATUS_PROCESS
    || status === BookStatus.STATUS_START_MEET
    || status === BookStatus.STATUS_RENEWAL;
  const titleColor = BookColorStatus[status] ? BookColorStatus[status] : BookColorStatus[5];

  return <TouchableOpacity onPress={goToDetail} style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.button,
        { backgroundColor: titleColor }]}>
        <Text style={styles.textButton}>
          {BookTextStatus[status] ? BookTextStatus[status] : BookTextStatus[5]}
        </Text>
      </TouchableOpacity>
      <Text style={styles.texttime}>{starTime}-{endTime} {date}</Text>
    </View>
    <View style={[styles.header, { marginVertical: 10, borderBottomWidth: 0 }]}>
      <View style={styles.avatar}>
        {staffs.length > 0 ? staffs.map((staff, index) => {
          const { avatar } = staff;
          return <FastImage resizeMode='cover'
            key={staff.id}
            style={{ flex: 1 }}
            source={avatar ? { uri: imageUrl + avatar.image_thumb_url } : require('../../assets/default-avatar.png')} />
        }) :
          <FastImage resizeMode='cover'
            style={{ flex: 1 }}
            source={require('../../assets/default-avatar.png')} />}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.text}>{service.name}</Text>
        {user_code && <Text style={styles.text}>{I18n.t('actions.staffs_name')}{staffs[0].name}</Text>}
        <Text style={styles.text}>{I18n.t('actions.hour')} {hour} {I18n.t('actions.action_detail.time')}</Text>
      </View>
      {checkReBook ?
        <View style={{ alignItems: 'flex-end' }}>
          {staffs.length > 0 && <TouchableOpacity
            onPress={() => reBooking(item)}
            style={styles.button}>
            <Text style={styles.textButton}>{I18n.t('actions.button')}</Text>
          </TouchableOpacity>}
          <TouchableOpacity
            style={{ marginTop: 10, paddingHorizontal: 10 }}
            onPress={() => deleteBooking(item)}>
            <Icon name="trash-can-outline" type="material-community" />
          </TouchableOpacity>
        </View> :
        (checkCreateConversation ? <View style={{ alignItems: 'flex-end' }}>
          {status === BookStatus.STATUS_START_MEET && <TouchableOpacity
            onPress={() => finishSoon(item, index)}
            style={styles.button}>
            <Text style={styles.textButton}>{I18n.t('actions.finish_soon')}</Text>
          </TouchableOpacity>}
          <TouchableOpacity
            style={{ marginTop: 10, paddingHorizontal: 10 }}
            onPress={() => goToChat(item)} >
            <FastImage style={{ height: 25, width: 25 }} source={require('../../assets/message-icon.png')} />
          </TouchableOpacity>
        </View> : <View style={[styles.button, { backgroundColor: Colors.WHITE }]} />)}
    </View>
  </TouchableOpacity>
}

const styles = {
  container: {
    backgroundColor: Colors.WHITE,
    width: 0.9 * width,
    marginBottom: 10,
    borderRadius: 7,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4
  },
  header: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 5,
    borderColor: '#e8e8e8'
  },
  button: {
    height: 27,
    backgroundColor: Colors.GREEN,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    flexDirection: 'row',
    marginRight: 20,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    overflow: 'hidden'
  },
  textButton: {
    color: Colors.WHITE,
    fontSize: 12
  },
  text: {
    fontSize: 12,
    paddingVertical: 5
  },
  texttime: {
    fontSize: 12,
  }
}
