import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { ComponentLayout } from '../../components/common/component-layout'
const { width } = Dimensions.get('window')

export class NotiDetails extends Component {
  render() {
    const { navigation } = this.props;
    const { notification } = navigation.state.params;
    const { title, body } = notification;
    return (
      <ComponentLayout navigation={this.props.navigation}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: '90%' }}>
            <Text>{body}</Text>
          </View>
        </View>
      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flex: 1
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 15
  },

  content: {

  }
})
