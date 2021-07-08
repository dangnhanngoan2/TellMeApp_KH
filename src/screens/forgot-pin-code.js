import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RadiusButton } from '../components/common/radius-button'
import { RadiusInput } from '../components/common/input-radius'
import { ComponentLayout } from '../components/common/component-layout'
import { apiAuth } from '../api/api-auth'
import { setLoading } from '../modules/progress-hud'
const { height, width } = Dimensions.get('window')

export class ForgotPinCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.phone = null
  }

  sendCodeForPhoneNumber = async () => {

    try {
      setLoading(true);
      const { user_id } = this.props.navigation.state.params
      console.log('abcdefeds', this.phone)
      const phone = this.phone
      const resultData = await apiAuth.sendSms(phone)
      setLoading(false)
      if (resultData.status === 'success') {
        this.props.navigation.navigate('CheckPinCode', { phone, user_id })
      } else {
        Alert.alert(I18n.t('common.alert_title'), resultData.message)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  render() {
    this.phone = this.props.navigation.state.params.phone
    console.log('this is props', this.props.navigation.state.params)
    return (
      <ComponentLayout noRight headerText={I18n.t('forgot.title_sendcode')} navigation={this.props.navigation}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputContainer}>
            <RadiusInput
              name={'phone'}
              style={styles.input}
              keyboardType='number-pad'
              icon={'phone'}
              maxLength={11}
              value={this.phone}
            />
          </View>
          <RadiusButton onPress={this.sendCodeForPhoneNumber} style={styles.buttonStyle} title={I18n.t('forgot.button_sendcode')} />
        </KeyboardAwareScrollView>
      </ComponentLayout>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingBottom: 20
  },
  textContent: {
    fontSize: 14,
    color: Colors.BLACK,
    marginLeft: 4
  },
  buttonStyle: {
    marginTop: 25 * height / 667
  },
  input: {
    marginTop: 8 * height / 667
  },
  inputContainer: {
    width: 0.85 * width,
    marginTop: 15
  },
});
