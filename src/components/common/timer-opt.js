import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer'
import { Text } from './text'

export class TimerBackground extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: 29
    }
  }

  componentDidMount() {
    this.timer = BackgroundTimer.setInterval(() => {
      if (this.state.timer > 0) {
        this.setState({ timer: this.state.timer - 1 })
      } else {
        if (this.timer) {
          BackgroundTimer.clearInterval(this.timer);
        }
      }
    }, 1000)
  }

  componentWillUnmount() {
    if (this.timer) {
      BackgroundTimer.clearInterval(this.timer);
    }
  }

  getString(time) {
    return <Text style={[styles.textContent]}>{I18n.t('common.waiting_opt')} {time} {I18n.t('common.seconds')}</Text>
  }

  render() {
    if (this.state.timer <= 0) {
      return <Text onPress={this.props.resend} style={styles.textContent}>{I18n.t('forgot.resend')}</Text>
    }
    return this.getString(this.state.timer)
  }
}

const styles = StyleSheet.create({

  greenText: {
    color: Colors.GREEN,
    marginVertical: 10
  },
  textContent: {
    fontSize: 13,
    color: Colors.GREEN,
    marginTop: 4,
    marginRight: 2,
  },

})
