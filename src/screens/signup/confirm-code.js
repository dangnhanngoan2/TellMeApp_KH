import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../../components/common/radius-button'
import { RadiusInput } from '../../components/common/input-radius'
import { ComponentLayout } from '../../components/common/component-layout'
import { apiAuth } from '../../api/api-auth'
import { setLoading } from '../../modules/progress-hud'
import { TimerBackground } from '../../components/common/timer-opt'
const { height, width } = Dimensions.get('window')

export class ConfirmCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
  }

  activeUser = async () => {
    const { code } = this.state;
    if (!code) {
      return Alert.alert(I18n.t('common.alert_title'), I18n.t('common.code_opt_error'))
    }
    try {
      setLoading(true);
      const { info } = this.props.navigation.state.params;
      const { phone } = info;
      const resultActive = await apiAuth.activeUser(phone, code)
      setLoading(false);
      if (resultActive.status === 'success') {
        this.props.navigation.navigate('CreatePin', { info })
      } else {
        Alert.alert(I18n.t('common.alert_title'), I18n.t('forgot.error_otp'))
      }
    } catch (error) {
      console.log('error: ', error)
      setLoading(false);
      Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.network_error'))
    }
  }

  checkCodeForPhoneNumber = async () => {
    const { code } = this.state;
    if (!code) {
      return Alert.alert(I18n.t('common.alert_title'), I18n.t('common.code_opt_error'))
    }
    try {
      setLoading(true);
      const { info } = this.props.navigation.state.params;
      const { phone } = info
      const resulData = await apiAuth.checkPincode(phone, code)
      setLoading(false);
      if (resulData.status === 'success') {
        this.props.navigation.navigate('CreatePin', { info })
      }
      else {
        Alert.alert(I18n.t('common.alert_title'), I18n.t('forgot.error_otp'))
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.network_error'))
    }
  }


  resend = async () => {
    try {
      setLoading(true);
      const { info } = this.props.navigation.state.params;
      const { phone } = info;
      const resultActive = await apiAuth.sendSms(phone)
      setLoading(false);
      if (resultActive.status === 'success') {
        Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.success'))
      } else {
        setLoading(true);
        Alert.alert(I18n.t('signup.alert_title'), resultActive.message)
      }
    } catch (error) {
      setLoading(true);
      Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.network_error'))
    }
  }

  render() {
    const { isForgotPinCode } = this.props.navigation.state.params;

    const confirmFunc = isForgotPinCode ? this.checkCodeForPhoneNumber : this.activeUser
    return (
      <ComponentLayout
        headerText={I18n.t('forgot.title_checkcode')}
        noRight
        navigation={this.props.navigation}>
        <Text style={styles.title}>{I18n.t('common.opt_title')}</Text>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputContainer}>
            <RadiusInput
              name={'phone'}
              style={styles.input}
              maxLength={4}
              value={this.state.code}
              onChangeText={(text) => this.setState({ code: text }, () => {
                if (text.length === 4) {
                  confirmFunc();
                }
              })}
              placeholder={I18n.t('forgot.enter_opt')}
            />
            <TimerBackground resend={this.resend} />
          </View>
          <RadiusButton
            onPress={confirmFunc}
            style={styles.buttonStyle}
            title={I18n.t('forgot.button_checkcode')} />
        </ScrollView>
      </ComponentLayout >
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingBottom: 20
  },
  buttonStyle: {
    marginTop: 15 * height / 667,
  },
  textContent: {
    fontSize: 13,
    color: Colors.GREEN,
    marginTop: 4,
    marginRight: 2,
  },
  input: {
    marginTop: 8 * height / 667
  },
  inputContainer: {
    width: 0.85 * width,
    marginTop: 15,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 14,
    width: 0.85 * width,
    textAlign: 'center',
    marginLeft: 0.075 * width,
    marginTop: 4
  }
});
