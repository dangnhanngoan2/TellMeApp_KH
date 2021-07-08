import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, FlatList, ActivityIndicator, BackHandler, Alert, AppState } from 'react-native'
import { connect } from 'react-redux'
import { Colors, I18n } from 'tell-me-common'
import moment from 'moment'
import SockJS from 'sockjs-client'
import * as Progress from 'react-native-progress';
import { NavigationActions } from 'react-navigation';
import { Stomp } from 'stompjs/lib/stomp'
import { ComponentLayout } from '../../components/common/component-layout'
import { PaymentsType } from '../../components/home/payments-type'
import { TimerOrderBooking } from '../../components/common/timer-order-booking'
import { SurPlus } from '../../components/home/items/surplus'
import { paymentMethod, BookStatus } from '../../common/static-data'
import { apiBooking } from '../../api/api-booking'
import { EmployeeItem } from '../../components/home/items/employee-item'
import { apiGeolocation } from '../../api/api-geolocation'
import { Text } from '../../components/common/text'
import { setLoading } from '../../modules/progress-hud'
import { apiProfile } from '../../api/api-profile'
import { socketUrl } from '../../api/api'
import { apiChat } from '../../api/api-chat'
import { saveAmount } from '../../actions/actions-user'
const { height, width } = Dimensions.get('window')

const Item = ({ name, value, isPecial }) => {
  return <View style={styles.itemContainer}>
    <View style={{ width: 150, flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text >{name}</Text>
      <Text>:</Text>
    </View>
    {isPecial ? <SurPlus size={18} content={`${value}`} /> : <Text> {value}</Text>}
  </View>
}

class OrderEmployee extends Component {
  constructor(props) {
    super(props)
    const { navigation } = props
    const { booking } = navigation.state.params
    const { staffs_ready_for_book } = booking;
    this.state = {
      percent: 0.01,
      employeeInfo: [],
      employees: staffs_ready_for_book ? staffs_ready_for_book : [],
      loading: true,
      book: booking,
      isConfirm: false,
      method: paymentMethod[0],
      price: {
        total_cash: 0,
        total_wallet: 0
      }
    }
  }

  async getBookProcess() {
    const bookProcessResult = await apiBooking.getBookProcess();
    console.log('bookProcessResult: ', bookProcessResult)
    if (bookProcessResult.status === 'success') {
      if (bookProcessResult.data) {
        const book = bookProcessResult.data;
        if (book.status === BookStatus.STATUS_PROCESS) {
          //this.props.navigation.push('MapView', { book, localStaffs: [] })
        } else if (book.status === BookStatus.STATUS_LOADING) {
          this.setState({ employees: book.staffs_ready_for_book })
        }
      }
    }
  }

  async componentDidMount() {
    // AppState.addEventListener('change', (appstatus) => {
    //   if (appstatus == 'active')
    //     this.getBookProcess();
    // });
    const currentLocation = await apiGeolocation.getCurrentLocation()
    this.currentRegion = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude
    }
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    this.connect();
  }

  connect() {
    const socket = new SockJS(`${socketUrl}/gs-guide-websocket`);
    this.stompClient = Stomp.over(socket);
    const { navigation } = this.props
    const { booking } = navigation.state.params
    const { timestamp } = booking;
    const endLoadingEmployee = moment.unix(timestamp).add(5, 'minute');
    if (endLoadingEmployee.unix() - moment().unix() < 0) {
      return;
    }
    this.stompClient.connect({}, (e) => {
      this.subscription = this.stompClient.subscribe(`/user/${booking.id}/queue/ready-booking`, (data) => {
        const staffs = JSON.parse(data.body);
        console.log('this.staffs: ', staffs)
        return this.setState({ employees: this.distinctArray(this.state.employees.concat(staffs)), loading: false })
      });
    }, err => {
      this.connect();
    });
  }

  componentWillUnmount() {
    //AppState.removeEventListener('change')
    this.backHandler.remove();
    this.subscription && this.subscription.unsubscribe();
  }

  endTimeEvent = async () => {
    this.setState({ loading: false });
    const { navigation } = this.props
    const { booking } = navigation.state.params
    const { employees } = this.state;
    if (employees.length === 0) {
      //
      try {
        await apiBooking.cancelBookNow(booking.id)
        Alert.alert(I18n.t('common.alert_title'),
          I18n.t('order_employee.alert_empty_staff.content'))
        // AppState.removeEventListener('change');
        this.setState({ isConfirm: true });
        this.props.navigation.navigate({
          routeName: 'News',
          action: NavigationActions.navigate({ routeName: 'Home' }),
        })
      } catch (error) {
        this.setState({ isConfirm: true });
        Alert.alert(I18n.t('common.alert_title'), 'Network error')
        this.props.navigation.navigate({
          routeName: 'News',
          action: NavigationActions.navigate({ routeName: 'Home' }),
        })
      }
    }
    this.subscription && this.subscription.unsubscribe();
  }

  calculateBook = async () => {
    const { navigation } = this.props
    const { booking } = navigation.state.params
    const { method, employeeInfo } = this.state;
    const priceForBook = await apiBooking.calculateBook(
      booking.service_id,
      method,
      employeeInfo.map(value => value.id),
      booking.hour
    );

    if (priceForBook.status === 'success') {
      this.setState({ price: priceForBook.data })
    }
  }

  chooseEmployee = (item, isPush) => {
    if (isPush) {
      this.setState({ employeeInfo: this.state.employeeInfo.concat(item) }, () => {
        this.calculateBook();
      })
    } else {
      this.setState({ employeeInfo: this.state.employeeInfo.filter(value => value.id !== item.id) }, () => {
        this.calculateBook();
      })
    }
  }

  distinctArray(array) {
    return Array.from(new Set(array.map(value => value.id))).map(id => {
      return {
        ...array.find(item => item.id === id)
      }
    })
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


  confirm = async () => {
    const { navigation, auth } = this.props
    const { booking } = navigation.state.params
    if (this.state.employeeInfo.length == 0) {
      return Alert.alert(I18n.t('common.alert_title'),
        I18n.t('order_employee.payment_type.alert_empty_staff')
      )
    }
    try {
      setLoading(true)
      const staff_ids = this.state.employeeInfo.map(value => value.id)
      const bookResult = await apiBooking.createBook({
        book_id: booking.id,
        method: this.state.method,
        staffs: staff_ids,
        timestamp: moment().unix()
      });
      console.log('book: ', bookResult);
      setLoading(false)
      if (bookResult.status == 'success') {
        // AppState.removeEventListener('change');
        this.setState({ isConfirm: true });
        this.stompClient.unsubscribe(`/user/${booking.id}/queue/ready-booking`);
        const chat = await apiChat.createConversation(booking.id, staff_ids.concat([auth.user.id]));
        this.updateAmount();
        navigation.push('MapView', { book: bookResult.data, localStaffs: this.state.employeeInfo })
      } else if (bookResult.status == 'AMOUNT_LESS_THAN_MIN_CONVERSION') {
        Alert.alert(
          I18n.t('common.alert_title'),
          I18n.t('order_employee.not_enough_money'),
          [
            {
              text: I18n.t('accounts.setting.logout.cancel'),
              onPress: () => { },
              style: 'cancel',
            },
            {
              text: I18n.t('common.ok'), onPress: async () => {
                await apiBooking.bookAfterFifteenMinute(booking.id)
                this.setState({ isConfirm: true });
                this.props.navigation.navigate({
                  routeName: 'News',
                  action: NavigationActions.navigate({ routeName: 'Home' }),
                })
              }
            },
          ],
        )
      } else {
        Alert.alert(I18n.t('common.alert_title'), bookResult.message)
      }
    } catch (error) {
      setLoading(false)
      Alert.alert(I18n.t('common.alert_title'), "Network error")
    }
  }

  timeSet = time => {
    const TIME_PICK_EMPL = 1;
    const TIME_LOADING_EMPL = 1;
    this.setState({ percent: (TIME_LOADING_EMPL * 60 - time) / (TIME_LOADING_EMPL*60) })
  }

  render() {
    const { employees, employeeInfo, loading, isConfirm, price, percent } = this.state
    const { navigation } = this.props
    const { order, booking } = navigation.state.params
    return (
      <ComponentLayout noLeft navigation={null}>
        <View style={styles.container}>
          {employees.length === 0 && loading ? <View style={[styles.scrollview, styles.noData]}>
            <Text style={{ textAlign: 'center', color: Colors.GREEN, marginBottom: 5, }}>{I18n.t('home.loading_employee')}</Text>
            <Progress.Bar color={Colors.GREEN} progress={percent} width={200} />
          </View> : (
              employees.length === 0 ?
                <View style={[styles.scrollview, styles.noData]}>
                  <Text>{I18n.t('order_employee.employee_empty')}</Text>
                </View>
                : <FlatList
                  contentContainerStyle={styles.scrollview}
                  data={employees}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <EmployeeItem
                    currentLocation={this.currentRegion}
                    onPress={this.chooseEmployee} key={item.id} item={item} />}
                />
            )}
          <View style={styles.infoContainer}>
            <TimerOrderBooking
              navigation={navigation}
              isConfirm={isConfirm}
              booking={booking}
              employees={employees}
              timeSet={this.timeSet}
              endTimeEvent={this.endTimeEvent}
              startTime={booking.timestamp} />
            {/* <Text style={styles.titleContent}>{I18n.t('order_employee.order_detail.title')}</Text>
            <Item name={I18n.t('order_employee.order_detail.employee')} value={`${employeeInfo.length} ${I18n.t('order_employee.order_detail.people')}`} />
            <Item name={I18n.t('order_employee.order_detail.time')} value={`${booking.hour} ${I18n.t('common.hour')}`} /> */}
            {/* <Text style={styles.titleContent}>{I18n.t('order_employee.order_detail.payment_method')}</Text> */}
            <PaymentsType
              isPick
              price={price}
              setItem={(method) => {
                this.setState({ method }, () => {
                  this.confirm()
                })
              }} />
          </View>
        </View>
      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  scrollview: {
    width: width,
    //paddingHorizontal: 0.05 * width
  },

  titleText: {
    color: Colors.RED,
    paddingVertical: 10,
    textAlign: 'center'
  },

  infoContainer: {
    alignItems: 'center',
    width: 0.9 * width
  },

  buttonStyle: {
    marginTop: 10
  },
  titleContent: {
    marginVertical: 7,
    fontWeight: '600',
    width: '100%'
  },

  itemContainer: {
    width: '98%',
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  noData: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 270 * height / 667
  }
})

mapStateToProps = ({ auth }) => {
  return {
    auth
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})


exports.OrderEmployee = connect(mapStateToProps, mapDispatchToProps)(OrderEmployee)
