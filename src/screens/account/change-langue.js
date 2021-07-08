import React, { Component } from 'react'
import { View, DeviceEventEmitter } from 'react-native'
import { CheckBoxText } from '../../components/common/check-box-text'
import { StaticData } from '../../common/static-data'
import { ComponentLayout } from '../../components/common/component-layout'
import I18n, { switchLanguage } from '../../common/localization/i18n'
//import en from '../../common/localization/'
export class ChangeLanguage extends Component {
  state = {
    language: I18n.defaultLocale
  }

  setLanguage = language => {
    switchLanguage(language);
    this.setState({ language });
    DeviceEventEmitter.emit(StaticData.CHANGE_LANGUAGE)
  }
  render() {
    const { language } = this.state
    console.log('language', language)
    return (
      <ComponentLayout
        headerText={I18n.t('accounts.setting.language.title')}
        rightHasNoti navigation={this.props.navigation}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <CheckBoxText
            title={I18n.t('accounts.setting.language.vi')}
            checked={language != 'vi'}
            onCheck={() => this.setLanguage('vi')}
          />
          <CheckBoxText
            title={I18n.t('accounts.setting.language.en')}
            checked={language != 'en'}
            onCheck={() => this.setLanguage('en')}
          />
        </View>
      </ComponentLayout>
    )
  }
} 