import React, { Component } from 'react'
import { View, Text, DeviceEventEmitter, Alert } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { apiChat } from '../../api/api-chat'

export class MessageTabIcon extends Component {

  state = {
    messageAmount: 0
  }

  getTotalUnread = async () => {
    try {

      
      //const unreadResult = await apiChat.getTotalUnread();
      const unreadResult = await apiChat.getTotalUnreadAll();
      console.log('unreadResult22: ----------', unreadResult)
      this.setState({ messageAmount: unreadResult })
      if (unreadResult.status === 'success') {
        console.log('unreadResult22333: ----------', unreadResult.data.total)
        this.setState({ messageAmount: unreadResult.data.total })
      } else {
        //Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
      }
    } catch (error) {
      //Alert.alert(I18n.t('common.alert_title'), 'Network error')
    }
  }

  componentDidMount() {
    this.getTotalUnread();
    DeviceEventEmitter.addListener('UPDATE_MESSAGE', () => {
      this.getTotalUnread()
    })
  }

  render() {
    const { messageAmount } = this.state;
    return (
      <View>
        {messageAmount > 0 && <View style={styles.badgeWrapper}>
          <Text style={styles.badgeCount}>{messageAmount}</Text>
        </View>}
        <MaterialCommunityIcons name={'chat-processing'} size={25} color={this.props.tintColor} />
      </View>
    )
  }
}

const BADGE_SIZE = 16

const styles = {
  badgeWrapper: {
    position: 'absolute',
    right: -9,
    top: -4,
    width: BADGE_SIZE,
    zIndex: 999,
    height: BADGE_SIZE,
    backgroundColor: '#f36a25',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BADGE_SIZE / 2
  },
  badgeCount: {
    fontSize: 8,
    color: Colors.WHITE
  },
}