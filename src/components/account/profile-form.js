import React, { useState, Fragment } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking, Alert
} from 'react-native'
import { Formik } from 'formik'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import { Colors, I18n } from 'tell-me-common'
import { CheckBox } from 'react-native-elements'
import { CheckBoxText } from '../common/check-box-text'
import { RadiusButton } from '../common/radius-button'
import { RadiusInput } from '../common/input-radius'
import { Text } from '../common/text'
import { isValidEmail, isValidPhone, isValidBirth } from '../../utils/utils-validation'

const { width, height } = Dimensions.get('window');

const validate = values => {
  let errors = {}

  if (!values.name) {
    errors.name = I18n.t('validate.required')
  }

  if (!values.email) {
    errors.email = I18n.t('validate.required')
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = I18n.t('validate.email')
  }

  if (values.birthday && !isValidBirth(values.birthday)) {
    errors.birthday = I18n.t('validate.birthday')
  }
  if (!values.phone) errors.phone = I18n.t('validate.required')
  else if (!isValidPhone(values.phone)) errors.phone = I18n.t('validate.phone')

  if (!values.partner_code) errors.partner_code = I18n.t('validate.required')
  return errors
}

export const ProfileForm = ({
  handleSubmit,
  profile,
  changeCountryCode,
  isEdit,
  data,
  setData
}) => {

  const [policy, setPolicy] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [sex, setSex] = useState(profile ? profile.sex : 0);
  let initValues;
  console.log('sex: ', sex)
  if (data) {
    initValues = {
      ...data
    }
  }

  if (profile) {
    initValues = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      birthday: profile.birthday,
      partner_code: profile.partner_code,
      latitude: 0,
      longitude: 0
    }
  }

  let dataFeild = [
    { id: 1, content: I18n.t('accounts.profile.name'), icon: 'account', name: 'name' },
    { id: 3, content: I18n.t('accounts.profile.phone'), icon: 'phone', name: 'phone', keyboardType: 'number-pad' },
    { id: 4, content: I18n.t('accounts.profile.email'), icon: 'email', name: 'email' },
    { id: 5, content: I18n.t('accounts.profile.birthday'), icon: 'cake-variant', name: 'birthday', keyboardType: 'number-pad' },
    { id: 6, keyboardType: 'default', content: I18n.t('accounts.profile.partner_code'), icon: 'barcode', name: 'partner_code' }
  ]

  // if (isSupplier) {
  //   data = data.concat(
  //     { id: 6, keyboardType: 'default', content: 'Mã đại lý', icon: 'barcode', name: 'partner_code' }
  //   )
  // }

  return (
    <Formik
      initialValues={initValues}
      validate={validate}
      onSubmit={values => handleSubmit({ ...values, sex, policy, isSupplier })}
      render={({ values, errors, setFieldValue, handleSubmit, isValid }) => {
        return (
          <Fragment>
            {
              dataFeild.map(value => {
                return <View key={value.id} style={styles.inputContainer}>
                  <Text style={styles.textContent}>{value.content}</Text>
                  <RadiusInput
                    titleNoRequire={value.id === 5}
                    error={errors[value.name]}
                    icon={value.icon}
                    name={value.name}
                    style={styles.input}
                    handleSubmit={(feild, value) => setData && setData({ ...values, [feild]: value })}
                    editable={isEdit && ((value.id !== 3 && value.id !== 6) ||  (value.id === 6 && !profile.partner_code))}
                    placeholder={value.id !== 2 ? (
                      value.id === 6 ? I18n.t('accounts.profile.partner_code_sup') : value.content
                    ) : I18n.t('accounts.profile.partner_code_sup')}
                    keyboardType={value.keyboardType || 'default'}
                    value={values[value.name]}
                    placeholderStyle={{ fontStyle: 'italic', }}
                    onChange={setFieldValue} />
                </View>
              })
            }
            <View style={styles.inputContainer}>
              <Text style={styles.textContent}>{I18n.t('accounts.profile.sex')}</Text>
              <View style={{ flexDirection: 'row' }}>
                <CheckBoxText
                  style={{ marginRight: '30%' }}
                  title={I18n.t('accounts.profile.male')}
                  checked={sex == 1}
                  onCheck={() => setSex(0)}
                />
                <CheckBoxText
                  title={I18n.t('accounts.profile.female')}
                  checked={sex == 0}
                  onCheck={() => setSex(1)}
                />
              </View>
              {/* {!profile && <View style={[styles.policy, { alignItems: 'center', marginTop: 5 }]}>
                <CheckBox
                  size={20}
                  checkedColor={Colors.GREEN}
                  containerStyle={[styles.checkboxContainer]}
                  checked={isSupplier}
                  textStyle={{ fontSize: 12, textAlign: 'center', marginLeft: 3 }}
                  onPress={() => {
                    setIsSupplier(!isSupplier);

                  }}
                />
                <Text style={{ marginTop: 5, }}>Mã đại lý</Text>
              </View>} */}
              <Text style={[styles.textpolicy, { marginLeft: 3, marginBottom: 5, }]}>{I18n.t('signup.policy_content')}</Text>
              {!profile && <View style={styles.policy}>

                <CheckBox
                  size={20}
                  checkedColor={Colors.GREEN}
                  containerStyle={styles.checkboxContainer}
                  checked={policy}
                  textStyle={{ fontSize: 12, textAlign: 'center', marginLeft: 3 }}
                  onPress={() => setPolicy(!policy)}
                />
                <Text onPress={() => Linking.openURL('https://nghelangnghe.vn/chinh-sach-dang-ky/#1545391856268-ae7ffbc9-42f0')} numberOfLines={2} style={[styles.textpolicy, { textDecorationLine: 'underline' }]}>
                  {I18n.t('signup.policy')}
                </Text>
              </View>}
            </View>
            <RadiusButton style={styles.buttonStyle} title={profile ? I18n.t('accounts.profile.button') : I18n.t('signup.register')}
              onPress={handleSubmit}
            />
          </Fragment>
        )
      }}
    />
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingBottom: 20
  },
  textpolicy: {
    paddingTop: 10,
    width: '100%',
    fontStyle: 'italic',
    color: Colors.GREEN
  },

  logo: {
    marginTop: 15 * height / 667,
    // width: 0.3 * width,
    // height: 0.3 * width,
    marginBottom: 10
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
  checkboxContainer: {
    backgroundColor: Colors.WHITE,
    borderWidth: 0,
    padding: 0,
    paddingTop: 6,
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 3
  },
  policy: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
})
