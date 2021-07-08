import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../components/common/radius-button'
import { RadiusInput } from '../components/common/input-radius'
import { ComponentLayout } from '../components/common/component-layout'
import { apiAuth } from '../api/api-auth'
import { setLoading } from '../modules/progress-hud'
const { height, width } = Dimensions.get('window')

export class UpdatePinCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPinCode: '',
      newPinCode: '',
      renewPinCode: ''
    }

    this.data = [
      { id: 2, content: I18n.t('update_pin.new_pin'), name: 'newPinCode', icon: 'lock' },
      { id: 3, content: I18n.t('update_pin.confirm_pin'), name: 'renewPinCode', icon: 'lock' },
    ];
  }

  onChange = (feild, value) => {
    this.setState({ [feild]: value });
  }

  changePinCode = async () => {
    const { newPinCode, renewPinCode } = this.state;
    if (renewPinCode !== newPinCode) {
      return Alert.alert(I18n.t('update_pin.alert_title'), I18n.t('update_pin.alert_confirm'))
    }
    setLoading(true);
    const changeResult = await apiAuth.updatePinCode(newPinCode, id);
    console.log(changeResult)
    setLoading(false);
    if (changeResult.status === 'success') {
      Alert.alert(I18n.t('update_pin.alert_title'), I18n.t('update_pin.alert_success'))
      this.props.navigation.goBack();
    } else {
      Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
    }
  }

  render() {
    return (
      <ComponentLayout headerText={I18n.t('update_pin.title')} rightHasNoti navigation={this.props.navigation}>
        <ScrollView contentContainerStyle={styles.container}>
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
          <RadiusButton onPress={this.changePinCode} style={styles.buttonStyle} title={I18n.t('update_pin.button')} />
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
