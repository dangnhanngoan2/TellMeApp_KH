import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../../components/common/radius-button'
import { RadiusInput } from '../../components/common/input-radius'
import { ComponentLayout } from '../../components/common/component-layout'
import { apiAuth } from '../../api/api-auth'
import { setLoading } from '../../modules/progress-hud'
const { height, width } = Dimensions.get('window')

export class CheckPinCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
    this.myphone = props.navigation.state.params.phone
  }

  checkCodeForPhoneNumber = async () => {
    try {
      const { code } = this.state
      const { user_id } = this.props.navigation.state.params
      const phone = this.myphone
      console.log('sattatatata', code, phone)
      const resulData = await apiAuth.checkPincode(phone, code)
      console.log('abcdefaecsadad',resulData)
      if (resulData.status === 'success') {
        this.props.navigation.navigate('CreatePin', { info: {user_id : user_id} })
      }
      else {
        Alert.alert(I18n.t('common.alert_title'),I18n.t(`${resulData.message}`))
      }
    } catch (error) {
    }
  }

  render() {
    console.log('propssss',this.props.navigation)
    return (
      <ComponentLayout noRight headerText={I18n.t('forgot.title_checkcode')} navigation={this.props.navigation}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputContainer}>
            <RadiusInput
              name={'phone'}
              style={styles.input}
              maxLength={6}
              value={this.state.code}
              onChangeText={(text) => this.setState({ code: text })}
              placeholder={"Nhập mã OTP"}
            />
          </View>
          <RadiusButton onPress={this.checkCodeForPhoneNumber} style={styles.buttonStyle} title={I18n.t('forgot.button_checkcode')} />
        </ScrollView>
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
