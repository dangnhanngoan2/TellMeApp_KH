import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions, Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { RadiusButton } from '../../components/common/radius-button'
import { RadiusInput } from '../../components/common/input-radius'
import { ComponentLayout } from '../../components/common/component-layout'
import { apiAuth } from '../../api/api-auth'
import { updatedAuth } from '../../actions/actions-auth'
import { setLoading } from '../../modules/progress-hud'
const { height, width } = Dimensions.get('window')

class ChangePinCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPinCode: '',
      newPinCode: '',
      renewPinCode: ''
    }

    this.data = [
      { id: 1, content: I18n.t('accounts.setting.change_code.old_code'), name: 'oldPinCode', icon: 'lock-open' },
      { id: 2, content: I18n.t('accounts.setting.change_code.new_code'), name: 'newPinCode', icon: 'lock' },
      { id: 3, content: I18n.t('accounts.setting.change_code.confirm_code'), name: 'renewPinCode', icon: 'lock' },
    ];
  }

  onChange = (feild, value) => {
    this.setState({ [feild]: value });
  }

  componentDidMount() {
    console.log('this.props: ', this.props)
  }

  changePinCode = async () => {
    const { dispatch, auth } = this.props;
    const { user } = auth;
    const { pin_code, id } = user;
    const { oldPinCode, newPinCode, renewPinCode } = this.state;
    if (pin_code !== oldPinCode) {
      return Alert.alert(I18n.t('accounts.setting.change_code.alert_title'),
        I18n.t('accounts.setting.change_code.alert_wrong_code'))
    }

    if (renewPinCode !== newPinCode) {
      return Alert.alert(I18n.t('accounts.setting.change_code.alert_title'),
        I18n.t('accounts.setting.change_code.alert_confirm_code'))
    }
    if (newPinCode === oldPinCode) {
      return Alert.alert(I18n.t('accounts.setting.change_code.alert_title')
        , I18n.t('accounts.setting.change_code.alert_duplicate'))
    }

    setLoading(true);
    const changeResult = await apiAuth.updatePinCode(newPinCode, id);
    console.log(changeResult)
    setLoading(false);
    if (changeResult.status === 'success') {
      console.log('auth: ', auth);
      dispatch(updatedAuth({
        ...auth,
        user: {
          ...auth.user,
          pin_code: newPinCode
        }
      }))
      Alert.alert(I18n.t('accounts.setting.change_code.alert_title'),
        I18n.t('accounts.setting.change_code.alert_success'))
      this.props.navigation.goBack();
    } else {
      Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
    }
  }

  render() {
    return (
      <ComponentLayout headerText={I18n.t('accounts.setting.change_code.title')} rightHasNoti navigation={this.props.navigation}>
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
          {
            this.data.map(value => {
              return <View key={value.id} style={styles.inputContainer}>
                <RadiusInput
                  name={value.name}
                  secureTextEntry
                  style={styles.input}
                  keyboardType='number-pad'
                  icon={value.icon}
                  maxLength={4}
                  value={this.state[value.name]}
                  onChange={this.onChange}
                  placeholder={value.content}
                />
              </View>
            })
          }
          <RadiusButton
            onPress={this.changePinCode}
            style={styles.buttonStyle}
            title={I18n.t('accounts.setting.change_code.button')} />
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

mapStateToProps = ({ auth }) => {
  return {
    auth
  };
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

exports.ChangePinCode = connect(mapStateToProps, mapDispatchToProps)(ChangePinCode)
