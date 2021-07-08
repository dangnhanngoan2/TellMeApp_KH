import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, TextInput, Alert, Text } from 'react-native'
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../../components/common/radius-button'
import { apiFeedback } from '../../api/api-feedback'
const { width, height } = Dimensions.get('window')

export class Feedback extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    }
  }

  createFeedback = async () => {
    if (this.state.content.trim() === "") {
      Alert.alert(I18n.t('accounts.feedback.alert_title'),
        I18n.t('accounts.feedback.alert_empty'))
    } else {
      try {
        const feedbackResult = await apiFeedback.createFeedback(this.state.content);
        if (feedbackResult.status === 'success') {
          return Alert.alert(I18n.t('accounts.feedback.alert_title'),
            I18n.t('accounts.feedback.feedback_success'))
        } else {
          Alert.alert(I18n.t('common.alert_title'),feedbackResult.message)
        }
      } catch (error) {
        Alert.alert(I18n.t('common.alert_title'),I18n.t('common.network_error'))
      }
    }
  }

  render() {

    const { content } = this.state;

    return (
      <ComponentLayout headerText={I18n.t('accounts.feedback.title')} rightHasNoti navigation={this.props.navigation}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={content}
              multiline
              onChangeText={text => this.setState({ content: text })}
            />
            <Text style={styles.hotline}>Hotline: 0919005856</Text>
          </View>
          <RadiusButton onPress={this.createFeedback} style={styles.buttonStyle} title={I18n.t('accounts.feedback.send_feedback')} />
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
  buttonStyle: {
    marginTop: 25 * height / 667
  },
  inputContainer: {
    width: '90%'
  },
  input: {
    height: 100,
    marginTop: 15,
    borderWidth: 0.5,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    borderRadius: 6,
    borderColor: Colors.GRAY_MEDIUM
  },
  hotline: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    fontSize: 12
  }
})
