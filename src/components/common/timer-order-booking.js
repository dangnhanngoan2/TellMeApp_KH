import React, { Component } from 'react'
import { View, StyleSheet, Alert, AppState } from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import moment from 'moment'
import { apiBooking } from '../../api/api-booking'
import BackgroundTimer from 'react-native-background-timer'
import { Text } from './text'
import { NavigationActions } from 'react-navigation';

const TIME_PICK_EMPL = 1;
const TIME_LOADING_EMPL = 1;
const TOTAL_TIME_LOAD = TIME_PICK_EMPL + TIME_LOADING_EMPL;

export class TimerOrderBooking extends Component {
  constructor(props) {
    super(props);
    const { startTime, employees } = props;
    console.log('startTime1: ', startTime)
    // 3 phút tìm kiêm ứng viên, 2 phút chọn ứng viên
    const endLoadingEmployee = moment.unix(startTime).add(TIME_LOADING_EMPL, 'minute');
    const endChooseEmployee = moment.unix(startTime).add(TOTAL_TIME_LOAD, 'minute');
    const timerLoadingEmployee = endLoadingEmployee.unix() - moment().unix();
    // khi thoát app vào lại mà thời gian tìm kiếm đã hết thì gọi hàm để back lại
    if (timerLoadingEmployee <= 0) {
      this.props.endTimeEvent();
    }
    const timerChooseEmployee = endChooseEmployee.unix() - moment().unix();
    this.state = {
      timerLoadingEmployee: timerLoadingEmployee,
      timerChooseEmployee: timerChooseEmployee
    }
  }

  componentDidMount() {

    //Khi ứng dụng thay đổi trạng thái, thoát ra background hoặc vào lại.
    AppState.addEventListener('change', (appstatus) => {
      if (appstatus == 'active') {
        const { startTime, employees, isConfirm } = this.props;
        console.log('this.props: ', this.props)
        if (isConfirm) {
          this.timer && BackgroundTimer.clearInterval(this.timer);
          return AppState.removeEventListener('change');
        }
        // 5 phút tìm kiêm ứng viên, 5 phút chọn ứng viên
        const endLoadingEmployee = moment.unix(startTime).add(TIME_LOADING_EMPL, 'minute');
        const endChooseEmployee = moment.unix(startTime).add(TOTAL_TIME_LOAD, 'minute');
        const timerLoadingEmployee = endLoadingEmployee.unix() - moment().unix();
        // khi thoát app vào lại mà thời gian tìm kiếm đã hết thì gọi hàm để back lại
        if (timerLoadingEmployee <= 0) {
          this.props.endTimeEvent();
          if (employees && employees.length === 0 && this.timer) {
            BackgroundTimer.clearInterval(this.timer);
            AppState.removeEventListener('change');
          }
        }
        const timerChooseEmployee = endChooseEmployee.unix() - moment().unix();
        this.setState({
          timerLoadingEmployee: timerLoadingEmployee,
          timerChooseEmployee: timerChooseEmployee
        })
      }
    });


    const { startTime } = this.props;
    this.timer = BackgroundTimer.setInterval(async () => {
      if (this.state.timerLoadingEmployee > 0) {
        this.setState({ timerLoadingEmployee: this.state.timerLoadingEmployee - 1 }, () => {

          this.props.timeSet(this.state.timerLoadingEmployee);

          const loadingTimeString = moment.unix(startTime).add(TIME_LOADING_EMPL, 'minute').format('HH:mm:ss');
          // Check thời gian 5 phút, thì sẽ call đến hàm endTimeEvent trong props: Chính là hàm sẽ chuyển qua chờ 5 phút hoặc back lại nếu ko có nhân viên
          if (this.state.timerLoadingEmployee <= 0 || loadingTimeString === moment().format('HH:mm:ss')) {
            const { employees } = this.props;
            if (employees && employees.length === 0) {
              BackgroundTimer.clearInterval(this.timer);
              AppState.removeEventListener('change');
            }
            this.setState({ timerLoadingEmployee: 0, timerChooseEmployee: TIME_PICK_EMPL*60 - 5 })
            this.props.timeSet(0);
            this.props.endTimeEvent();
          }
        });
      }

      // chon nhan vien
      if (this.state.timerChooseEmployee > 0) {

        this.setState({ timerChooseEmployee: this.state.timerChooseEmployee - 1 }, async () => {
          console.log('this.state.timerChooseEmployee12: ', this.state.timerChooseEmployee)
          const endChooseEmployee = moment.unix(startTime).add(TOTAL_TIME_LOAD, 'minute').format('HH:mm:ss');
          if (this.state.timerChooseEmployee <= 0 || endChooseEmployee === moment().format('HH:mm:ss')) {
            // 1 là type khi cancel book now khi hết 7 phút
            await apiBooking.bookAfterFifteenMinute(this.props.booking.id)
            BackgroundTimer.clearInterval(this.timer);
            AppState.removeEventListener('change');
            Alert.alert(I18n.t('order_employee.alert_not_choose_staff.title'), I18n.t('order_employee.alert_not_choose_staff.time_up'))
            this.props.navigation.navigate({
              routeName: 'News',
              action: NavigationActions.navigate({ routeName: 'Home' }),
            })
          }
        });
      } else {
        console.log('this.state.timerChooseEmployee1: ', this.state.timerChooseEmployee)
        const endChooseEmployee = moment.unix(startTime).add(TOTAL_TIME_LOAD, 'minute').format('HH:mm:ss');
        if (this.state.timerChooseEmployee <= 0 || endChooseEmployee === moment().format('HH:mm:ss')) {
          // 1 là type khi cancel book now khi hết 7 phút
          await apiBooking.bookAfterFifteenMinute(this.props.booking.id)
          BackgroundTimer.clearInterval(this.timer);
          AppState.removeEventListener('change');
          Alert.alert(I18n.t('order_employee.alert_not_choose_staff.title'), I18n.t('order_employee.alert_not_choose_staff.time_up'))
          this.props.navigation.navigate({
            routeName: 'News',
            action: NavigationActions.navigate({ routeName: 'Home' }),
          })
        }
      }
    }, 1000)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change');
    if (this.timer) {
      BackgroundTimer.clearInterval(this.timer);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.isConfirm !== this.props.isConfirm && nextProps.isConfirm === true) {
      if (this.timer) {
        AppState.removeEventListener('change');
        BackgroundTimer.clearInterval(this.timer);
      }
    }
  }

  getString() {
    const { timerLoadingEmployee, timerChooseEmployee } = this.state;
    const { startTime, employees } = this.props;
    const endLoadingEmployee = moment.unix(startTime).add(TIME_LOADING_EMPL, 'minute').format('HH:mm:ss');
    if (timerLoadingEmployee <= 0 || endLoadingEmployee === moment().format('HH:mm:ss')) {

      if (timerChooseEmployee <= TIME_PICK_EMPL*60 && timerChooseEmployee > 0) {
        return <Text style={styles.titleText}>{I18n.t('order_employee.alert_not_choose_staff.time_remaining')} {timerChooseEmployee} {I18n.t('order_employee.alert_not_choose_staff.seconds')}!</Text>
      }
      return <Text style={styles.titleText}></Text>
    }
    return <Text style={styles.titleText}></Text>
  }

  render() {
    return this.getString()
  }
}

const styles = StyleSheet.create({

  titleText: {
    color: Colors.RED,
    paddingVertical: 10,
    textAlign: 'center'
  },

})
