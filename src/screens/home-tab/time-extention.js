import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, DeviceEventEmitter, Alert } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { PaymentsType } from '../../components/home/payments-type'
import { SurPlus } from '../../components/home/items/surplus'
import { Text } from '../../components/common/text'
import { apiBooking } from '../../api/api-booking'
import { hoursExtention } from '../../common/static-data'
import { setLoading } from '../../modules/progress-hud'
import { saveAmount } from '../../actions/actions-user'
import { apiProfile } from '../../api/api-profile'
import { ChooseHoursExtention } from '../../components/home/choose-hour-extention'
import { TimerBackground } from '../../components/common/timer-background'
const { height, width } = Dimensions.get('window')

const Item = ({ name, value, isPecial }) => {
  return <View style={{ width: '100%', paddingVertical: 7, flexDirection: 'row' }}>
    <Text style={{ width: 150 }}>{name}</Text>
    {isPecial ? <SurPlus size={18} content={`: ${value}`} /> : <Text>: {value}</Text>}
  </View>
}

class TimeExtention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hour: hoursExtention[0],
      book_detail: null,
      price: {
        total_cash: 0,
        total_wallet: 0
      }
    }
  }

  async componentDidMount() {
    setLoading(true)
    const { book } = this.props.navigation.state.params;
    console.log('book ext: ', book)
    try {
      if (book) {
        const bookDetailResult = await apiBooking.getBookDetail(book);
        console.log('bookDetailResult: ', bookDetailResult)
        if (bookDetailResult.status === 'success') {
          const { staffs, service_id } = bookDetailResult.data;
          const priceForBook = await apiBooking.calculateBook(
            service_id,
            1,
            staffs.map(value => value.id),
            this.state.hour.value
          );
          setLoading(false)
          if (priceForBook.status === 'success') {
            this.setState({ price: priceForBook.data, book_detail: bookDetailResult.data })
          }
        } else {
          setLoading(false)
          Alert.alert(I18n.t('common.alert_title'), bookDetailResult.success)
        }
      }
    } catch (error) {
      setLoading(false)
      Alert.alert(I18n.t('common.alert_title'), 'Network Error')
    }
  }

  exit = () => {
    this.props.navigation.push('Review')
  }

  updateAmount = async () => {
    const { auth, dispatch } = this.props;
    if (auth) {
      const { user } = auth;
      const profileResult = await apiProfile.getProfile(user.id);
      if (profileResult.status === 'success') {
        const { data } = profileResult;
        const amount = data.wallet.amount;
        dispatch(saveAmount(amount))
      }
    }
  }

  confirm = async (method) => {
    const { navigation } = this.props
    const { hour, book_detail, price } = this.state;
    const extendTime = await apiBooking.renewalBook(book_detail.id, method, hour.value);
    console.log('extendTime: ', extendTime)
    if (extendTime.status === 'success') {
      this.updateAmount();
      DeviceEventEmitter.emit('UPDATE_BACK_TO_HOME')
      navigation.navigate({
        routeName: 'News',
        action: NavigationActions.navigate({ routeName: 'Home' }),
      })
      Alert.alert(I18n.t('extension.alert_title'), I18n.t('extension.alert'))
    }
  }

  setHour = async (hour) => {
    const { book_detail } = this.state;
    const { staffs, service_id } = book_detail;
    // this.setState({ hour: time })
    const priceForBook = await apiBooking.calculateBook(
      service_id,
      1,
      staffs.map(value => value.id),
      hour.value
    );
    console.log('priceForBook: ', priceForBook);
    if (priceForBook.status === 'success') {
      this.setState({ price: priceForBook.data, hour: hour })
    }
  }

  render() {

    const { hour, book_detail, price } = this.state;
    let staffs = [];
    if (book_detail) {
      staffs = book_detail.staffs
    }

    return (
      <ComponentLayout
        backFunction={() => {
          DeviceEventEmitter.emit('UPDATE_BACK_TO_HOME')
          this.props.navigation.navigate({
            routeName: 'News',
            action: NavigationActions.navigate({ routeName: 'Home' }),
          })
        }}
        noRight navigation={this.props.navigation}>
        {book_detail ? <View style={styles.container}>
          <Text style={styles.blackText}>
            {I18n.t('extension.extant')}:
          </Text>
          <TimerBackground timer={10} />
          <Text style={styles.blackText}>{I18n.t('extension.extra_extension')}:</Text>
          <ChooseHoursExtention styleContainer={{ marginTop: 0 }} noTitle setItem={(time) => this.setHour(time)} />
          <Text style={styles.blackText}>{I18n.t('extension.cost')}</Text>
          <Item name={'Số nhận viên'} value={`${staffs.length} người`} />
          <Item name={'Thời lượng'} value={hour.name} />
          <Text style={styles.titleContent}>{I18n.t('extension.payment_method')}</Text>
          <PaymentsType price={price} setItem={(method) => {
            this.confirm(method)
          }} />
        </View> : <View style={styles.container} />}
      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    // alignItems: 'center',
    paddingLeft: 15,
    paddingBottom: 20
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  blackText: {
    color: Colors.BLACK,
    fontWeight: '600',
    marginVertical: 10
  },

  cancelButton: {
    width: 0.3 * width,
    borderColor: Colors.GREEN,
    borderWidth: 1,
    height: 35
  },
  containerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40 * width / 375,
    marginTop: 10
  },

  titleContent: {
    marginTop: 7,
    fontWeight: '600',
    width: '100%'
  },

})

mapStateToProps = ({ auth }) => {
  return {
    auth
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})


exports.TimeExtention = connect(mapStateToProps, mapDispatchToProps)(TimeExtention)