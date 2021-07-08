import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { Formik } from 'formik'
import { Colors, I18n } from 'tell-me-common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { apiBankInfo } from '../../api/api-bank-info'
import { RadiusButton } from '../common/radius-button'
import { RadiusInput } from '../common/input-radius'
import { Text } from '../common/text'
import ModalManager from '../../components/modal-controller/modal-controller'
import { isValidEmail, isValidPhone, isValidBirth } from '../../utils/utils-validation'

const { height, width } = Dimensions.get('window')

let dataFeild = [
  { id: 1, content: 'Tên ngân hàng', icon: 'bank', name: 'bank_name' },
  { id: 3, content: 'Chi nhánh', icon: 'bank-transfer', name: 'bank_branch' },
  { id: 4, content: 'Chủ sở hữu', icon: 'rename-box', name: 'bank_owner' },
  { id: 5, content: 'Số tài khoản', icon: 'cake-variant', name: 'bank_number', keyboardType: 'number-pad' },
  { id: 6, keyboardType: 'default', content: 'Ghi chú', icon: 'barcode', name: 'bank_note' }
];

const validate = values => {
  let errors = {}

  if (!values.bank_name ) {
    errors.bank_name = I18n.t('validate.required')
  }
  if (!values.bank_branch) {
    errors.bank_branch = I18n.t('validate.required')
  }
  if (!values.bank_owner) {
    errors.bank_owner = I18n.t('validate.required')
  }
  if (!values.bank_number) {
    errors.bank_number = I18n.t('validate.required')
  }
  return errors
}

const initValues ={
  bank_name: '',
  bank_branch: '',
  bank_owner: '',
  bank_number: '',
  bank_note: ''
}


export class Withdrawal extends Component {


  handleSubmit = async (values)=> {
    console.log('values: ', values)
   try {
     const result = await apiBankInfo.customerPayment({
       ...values
     });
     console.log('result: ', result)
     if(result.status === 'success'){
       Alert.alert('Thông báo', 'Gửi yêu cầu thành công');
       ModalManager.dismiss()
     }
   } catch (error) {
     Alert.alert('Thông báo', 'Đã có lỗi xảy ra');
   }
  }


  render() {
    return (
      <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Thông tin tài khoản</Text>
        <Formik
          initialValues={initValues}
          validate={validate}
          onSubmit={values => this.handleSubmit(values)}
          render={({ values, errors, setFieldValue, handleSubmit, isValid }) => {
            return (
              <>
                {
                  dataFeild.map(value => {
                    return <View key={value.id} style={styles.inputContainer}>
                      <Text style={styles.textContent}>{value.content}</Text>
                      <RadiusInput
                        error={errors[value.name]}
                        icon={null}
                        name={value.name}
                        style={styles.input}
                        keyboardType={value.keyboardType || 'default'}
                        value={values[value.name]}
                        placeholderStyle={{ fontStyle: 'italic', }}
                        onChange={setFieldValue} />
                    </View>
                  })
                }
                <RadiusButton style={styles.buttonStyle} title={'Rút tiền'}
                  onPress={handleSubmit}
                />
              </>
            )
          }}
        />
      </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingBottom: 20
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: Colors.BLACK,
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
})
