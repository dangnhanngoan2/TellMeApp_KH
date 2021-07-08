import React, { Component, Fragment } from 'react'
import { Alert } from 'react-native'
import { paymentMethod } from '../../common/static-data'
import { PaymentType } from './items/payment-type'
import { I18n, Colors } from 'tell-me-common'
export class PaymentsType extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payment_type: paymentMethod[0]
    }
  }

  onPress = (item) => {
    if (item === paymentMethod[1]) {
      Alert.alert(I18n.t('common.alert_title'),
        I18n.t('order_employee.payment_type.alert'))
    }
    console.log('GOTO PAYMENT_TYPE', this.props)
    this.props.setItem(item, 'payment_type')
    this.setState({ payment_type: item })
  }

  render() {
    const { payment_type } = this.state
    const { price, isPick } = this.props;
    return (
      <Fragment>
        <PaymentType
          isPick={isPick}
          isChoose={payment_type === paymentMethod[0]}
          style={[{ marginTop: 20 }, isPick ? { backgroundColor: Colors.GREEN } : {}]}
          onPress={() => this.onPress(paymentMethod[0])}
          title={I18n.t('order_employee.payment_type.heart')}
          amount={price.total_wallet}
          isHeart />
        <PaymentType
          isPick={isPick}
          style={isPick ? { backgroundColor: '#f49138' } : {}}
          isChoose={payment_type === paymentMethod[1]}
          payment_type={payment_type}
          onPress={() => this.onPress(paymentMethod[1])}
          title={I18n.t('order_employee.payment_type.monney')}
          amount={price.total_cash} />
      </Fragment>

    )
  }
}