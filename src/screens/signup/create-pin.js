import React, { Component, Fragment } from 'react'
import { View, StyleSheet, Dimensions, Image, TextInput, Alert, Keyboard, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { connect } from 'react-redux'
import { Header } from '../../components/header/header-authen'
import { apiAuth } from '../../api/api-auth'
import { updateAuthData } from '../../actions/actions-auth'
import { saveAmount } from '../../actions/actions-user'
import { Text } from '../../components/common/text'
import { RadiusButton } from '../../components/common/radius-button'
import { cache } from '../../utils/cache'
import FastImage from 'react-native-fast-image'

const { width, height } = Dimensions.get('window')
class CreatePin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: ''
    }
    
  }

  createPinCode = async () => {
    //this.input.blur();
    Keyboard.dismiss()
    const { code } = this.state;
    if (code.length !== 4) {
      return Alert.alert(I18n.t('signup.creat_pin.alert_title'), I18n.t('signup.creat_pin.alert'))
    }
    const { navigation } = this.props;
    if (navigation.state.params) {

      const { info } = navigation.state.params
      console.log('info: ', info)
      const createdPinCode = await apiAuth.updatePinCode(code, info.id ? info.id : info.user_id);
      if (createdPinCode.status === 'success') {
        this.loginWithPhone()
      } else {
        Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
      }

    }
  }

  loginWithPhone = async () => {
    try {
      const { dispatch, navigation } = this.props
      const { info } = navigation.state.params;
      const { phone } = info
      const { code } = this.state
      const cachedIds = cache.getIds()
    
      const loginInfo = await apiAuth.login(phone, code, cachedIds ? cachedIds.userId : null);
      if (loginInfo.data && loginInfo.data.token) {
        let amount = 0;
        const { user } = loginInfo.data;
        if (user) {
          amount = user.wallet.amount;
        }
        //this.input.blur();
        dispatch(updateAuthData(loginInfo.data, phone));
        dispatch(saveAmount(amount));
        this.props.navigation.push('News');
      }
    } catch (error) {
      Alert.alert(I18n.t('login.alert_title'), 'Network error')
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss()
  }

  onShowKeyBoard = () => {
    this.input && this.input.focus()
  }

  onChangeText = (text) => {
    this.setState({ code: text }, () => {
      if (text.length === 4) {
        this.createPinCode()
      }
    });
  }

  render() {

    const { code } = this.state;

    return (
      <Fragment>
        <Header title={'Tạo mã pin'} navigation={this.props.navigation} />
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.container}>
          <FastImage resizeMode='contain' style={styles.logo} source={require('../../assets/login/logo.png')} />
          <Text style={[styles.textNormal, { fontSize: 20 }]}>{I18n.t('signup.creat_pin.title_app')}</Text>
          <Text style={styles.textNormal}>{I18n.t('signup.creat_pin.title_screen')}</Text>
          <View style={styles.inputcode}>
            {
              [1, 1, 1, 1].map((value, index) => {
                return <TouchableOpacity
                  key={index}
                  onPress={this.onShowKeyBoard}
                  style={styles.codeContainer}>
                  {code[index] ? <Text style={styles.textinput}>*</Text> : <Text style={styles.textinput}></Text>}
                </TouchableOpacity>
              })
            }
            <TextInput
              maxLength={4}
              ref={ref => this.input = ref}
              // onBlur={() => {
              //   this.input.focus();
              // }}
              onChangeText={text => this.onChangeText(text)}
              keyboardType='number-pad'
              autoFocus
              style={{ position: 'absolute', top: -1000 }} />
          </View>
          <RadiusButton onPress={this.createPinCode} style={styles.buttonStyle} title={I18n.t('signup.creat_pin.button')} />
          <Text style={styles.textlogout} onPress={() => { this.props.navigation.navigate('Login') }}>{I18n.t('signup.creat_pin.exit')}</Text>
        </ScrollView>

      </Fragment>

    )
  }

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingBottom: 20,
    height: height
  },
  logo: {
    marginTop: 20 * height / 667,
    justifyContent: 'center',
    width: 70,
    height: 100
  },
  inputcode: {
    flexDirection: 'row',
    marginTop: 25 * height / 667
  },
  codeContainer: {
    borderBottomWidth: 4,
    borderBottomColor: Colors.GRAY_MEDIUM,
    width: 45,
    height: 35,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textinput: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700',
    color: Colors.GRAY_MEDIUM,
  },
  buttonStyle: {
    marginTop: 35 * height / 667
  },
  textlogout: {
    paddingLeft: 0.55 * width,
    paddingTop: 10

  },
  textNormal: {
    fontSize: 15,
    marginTop: 25 * height / 667
  }
})

exports.CreatePin = connect()(CreatePin)
