import React, { Fragment } from 'react'
import { View, Image, Clipboard, Dimensions, Alert } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { Icon } from 'react-native-elements'
import { Text } from '../common/text'

const { width } = Dimensions.get('window');

const ChildItem = ({ title, content, detail, number }) => {

  return <Fragment>
    <View style={{ marginTop: 5 }}>
      <Text style={styles.textTitle}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text style={styles.text}>{content}{' '}</Text>
        <Text onPress={async () => {
          await Clipboard.setString(number);
          return Alert.alert(I18n.t('accounts.feedback.alert_title'),
            'Sao chép số tài khoản thành công')
        }} selectable={true} style={[styles.text, { color: Colors.BLUE_TEXT_LINK, textDecorationLine: 'underline' }]}>{number}</Text>
      </View>
      <Text style={styles.text}>{detail}</Text>
    </View>
  </Fragment>
}

export const PaymentItem = ({ bankInfo }) => {
  return <View style={styles.container}>
    {bankInfo.map(bank => {
      return <ChildItem title={I18n.t('payment.bank')} content={`${bank.bank}`} number={bank.account_number} detail={`${bank.owner} ${bank.description? bank.description : ''}`} />
    })}

    {/* <ChildItem title={I18n.t('payment.bank')} content="Ngân hàng Á châu ACB" number=" 61872409" detail="Nguyễn Xuân Thiện, chi nhánh Hà Thành, HN" /> */}
    {/* <ChildItem title={I18n.t('payment.bank')} content="Teckcombank" number=" 14023056453019" detail="Nguyễn Xuân Thiện, chi nhánh Trần Duy Hưng, HN" /> */}
    {/* <ChildItem title={I18n.t('payment.bank')} content="Techcombank" number=" 19025328492011" detail="Ngô Duy Đông, chi nhánh hội sở chính(Hà Nội)" /> */}
    <Text style={styles.textcontent}>
      Khi bạn chuyển khoản vào các tài khoản trên thì tiền của bạn sẽ ngay lập tức được quy đổi thành <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text> để có thể bắt đầu sử dụng Dịch vụ.
              </Text>
    <Text style={styles.textcontent}>
      {I18n.t('payment.text5')}
    </Text>
  </View>
}

const styles = {
  container: {
    backgroundColor: Colors.WHITE,
    width: width - 30,
    marginBottom: 18,
    paddingVertical: 10,
    paddingLeft: 12,
    borderRadius: 7,
    // borderColor: 'red',
    // borderWidth: 1,rrr
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    paddingVertical: 3,
    fontSize: 13
  },
  textTitle: {
    fontSize: 12,
    marginLeft: 2,
    paddingVertical: 3,
    color: Colors.LIGHT_GREY
  },
  textcontent: {
    fontSize: 13,
    paddingHorizontal: 0.01 * width,
    paddingTop: 10,
  },
}
