import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Alert, DeviceEventEmitter } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
import { ComponentLayout } from '../../components/common/component-layout'
import { connect } from 'react-redux'
import { Colors, I18n } from 'tell-me-common'
import { Text } from '../../components/common/text'
import { AccountItem } from '../../components/account/account-item'
import { apiAuth } from '../../api/api-auth'
import { StaticData } from '../../common/static-data'
import { Icon } from '../../components/common/icon'
import { updateAuthData, clearAuth } from '../../actions/actions-auth'
const { width } = Dimensions.get('window')

class Setting extends Component {
  componentDidMount() {
    DeviceEventEmitter.addListener(StaticData.CHANGE_LANGUAGE, () => {
      this.setState({ language: true })
    })
  }
  render() {
    const data = [
      {
        title: I18n.t('accounts.setting.change_code.title'),
        right: <Icon color={Colors.GREYISH_BROWN} size={24} name={'right'} />,
        onPress: () => this.props.navigation.navigate('ChangePinCode')
      },
      {
        title: I18n.t('accounts.setting.language.title'),
        right: <Text style={styles.greenText}>{I18n.defaultLocale === 'vi' ? "Tiếng việt" : "English"}</Text>,
        onPress: () => this.props.navigation.navigate('ChangeLanguage')
      },
      {
        title: I18n.t('accounts.setting.logout.title'),
        right: <View />,
        onPress: () => {
          Alert.alert(
            I18n.t('accounts.setting.logout.alert_title'),
            I18n.t('accounts.setting.logout.alert_content'),
            [
              {
                text: I18n.t('accounts.setting.logout.cancel'),
                onPress: () => { },
                style: 'cancel',
              },
              {
                text: I18n.t('accounts.setting.logout.ok'), onPress: async () => {
                  const { dispatch } = this.props
                  await apiAuth.logout();
                  dispatch(clearAuth());
                  this.props.navigation.push('Login')
                }
              },
            ],
          )
        }
      }
    ]
    return (
      <ComponentLayout
        backFunction={() => {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'News' })],
          });

          const accountTab = NavigationActions.navigate({ routeName: 'Account' })
          this.props.navigation.dispatch(resetAction)
          this.props.navigation.dispatch(accountTab)
        }}
        headerText={I18n.t('accounts.setting.title')}
        rightHasNoti navigation={this.props.navigation}>
        <View style={styles.container}>
          <View style={{ marginTop: 30 }}>
            {data.map((value, index) => {
              return <AccountItem
                key={index}
                onPress={value.onPress}
                hasNotIcon
                title={value.title}
                right={value.right}
              />
            })}
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
  greenText: {
    color: Colors.GREEN,
    fontSize: 14,
    // paddingVertical: 10,
    paddingTop: 0,
    textAlign: 'center'
  }
})

exports.Setting = connect()(Setting)