import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from 'tell-me-common'
import moment from 'moment'
import BackgroundTimer from 'react-native-background-timer'
import { Text } from './text'

export class TimerBackground extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: props.timer * 60 - 5
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
    const endTime = moment().startOf('day').add(time, 'second')
    const dateString = moment(endTime).format('mm')
    return <Text style={[styles.greenText, { fontSize: 30, fontWeight: '600' }]}>{dateString} Phút</Text>
  }

  render() {
    return (
      <View style={{ marginVertical: 15, alignItems: 'center', justifyContent: 'center' }}>
        {this.getString(this.state.timer)}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  greenText: {
    color: Colors.GREEN,
    marginVertical: 10
  }

})
