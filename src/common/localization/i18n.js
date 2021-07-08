/**
 * @flow
 */
import I18n from 'react-native-i18n'
import { store } from '../../app';
import { setLanguage } from '../../actions/actions-config'
// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true
I18n.defaultLocale = 'vi'

// English language is the main language for fall back:
I18n.translations = {
  vi: require('./vi.json'),
  en: require('./en.json')
}

export const languageCode = I18n.locale.substr(0, 2)
I18n.locale = 'vi';

// All other translations for the app goes to the respective language file:
switch (languageCode) {
  case 'en':
    I18n.translations.en = require('./en.json')
    break
  case 'vi':
    I18n.translations.vi = require('./vi.json')
    break
  default:
    I18n.translations.en = require('./vi.json')
    break
}

export function switchLanguage(locale = 'vi') {
  I18n.defaultLocale = locale;
  I18n.locale = locale;
  store.dispatch(setLanguage(locale));
}
export default I18n
