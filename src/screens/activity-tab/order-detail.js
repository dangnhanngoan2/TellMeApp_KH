import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Dimensions, ScrollView, Alert, DeviceEventEmitter } from 'react-native'
import { connect } from 'react-redux'
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { NavigationActions } from 'react-navigation';
import { apiBooking } from '../../api/api-booking'
import { apiProfile } from '../../api/api-profile'
import { Text } from '../../components/common/text'
import { saveAmount } from '../../actions/actions-user'
import { SurPlus } from '../../components/home/items/surplus'
import { RadiusButton } from '../../components/common/radius-button'
import { StaticData, BookStatus } from '../../common/static-data'
const { width } = Dimensions.get('window')

const Item = ({ title, value, isSpecial, id }) => {
  return <View key={id} style={styles.itemContainer}>
    <Text style={styles.title}>
      {title}
    </Text>
    {value && <Text>: {' '}</Text>}
    {!isSpecial ? <Text style={styles.textDetail}>
      {value}
    </Text> : value}
  </View>
}
class OrderDetail extends Component {
  constructor(props) {
    super(props)
    const { bookDetail } = props.navigation.state.params;
    const { hour, address, status, method, amount } = bookDetail;
    const price = this.caculatorPrice();
    this.data = [
      {
        id: 1, title: I18n.t('actions.action_detail.hour'),
        value: `${hour} ${I18n.t('actions.action_detail.time')}`
      },
      {
        id: 2, title: I18n.t('actions.action_detail.address'),
        value: `${address}`
      },
      status !== BookStatus.STATUS_CANCEL && price.heartPrice > 0 && {
        id: 3,
        title: I18n.t('actions.action_detail.paymen_method'),
        value: 'Ví Tellme'
      },
      status !== BookStatus.STATUS_CANCEL && price.heartPrice > 0 && {
        id: 4,
        title: I18n.t('actions.action_detail.price'),
        value: <SurPlus textStyle={{ fontSize: 12 }} size={16} content={price.heartPrice} />
      },
      status !== BookStatus.STATUS_CANCEL && price.cashPrice > 0 && {
        id: 5,
        title: I18n.t('actions.action_detail.paymen_method'),
        value: 'Cash'
      },
      status !== BookStatus.STATUS_CANCEL && price.cashPrice > 0 && {
        id: 6,
        title: I18n.t('actions.action_detail.price'),
        value: <Text>{price.cashPrice}K</Text>
      }
    ]
  }
  booktext = {
    '5': I18n.t('actions.text_static.used'),
    '0': I18n.t('actions.text_static.upcoming'),
    '2': I18n.t('actions.text_static.upcoming'),
    '1': I18n.t('actions.text_static.cancel'),
    '4': I18n.t('actions.text_static.process'),
    '3': I18n.t('actions.text_static.process'),
    '-1': I18n.t('actions.text_static.waiting'),
    '-2': I18n.t('actions.text_static.waiting')
  }

  caculatorPrice() {
    const { bookDetail } = this.props.navigation.state.params;
    const { book_extend, method, amount } = bookDetail;
    let cashPrice = 0;
    let heartPrice = 0;
    if (method === 1) {
      heartPrice = amount;
    } else if (method === 0) {
      cashPrice = amount;
    }
    if (book_extend) {
      book_extend.forEach(book => {
        if (book.method === 1) {
          heartPrice += book.amount;
        } else if (book.method === 0) {
          cashPrice += book.amount;
        }
      })

    }
    return {
      cashPrice,
      heartPrice
    }
  }

  titleCheck = () => {
    const { bookDetail } = this.props.navigation.state.params;
    const { status } = bookDetail;
    const titleText = this.booktext[status] ? this.booktext[status] : this.booktext[5];
    return titleText.toLowerCase()
  }

  gotochat = (book) => {
    this.props.navigation.navigate('MessageDetail', { book })
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


  cancelBooking = () => {
    const { navigation } = this.props
    const { bookDetail } = navigation.state.params
    console.log('bookDetail: ', bookDetail)
    let content = I18n.t('card_info.alert_content');
    if (bookDetail.status == -1) {
      content = I18n.t('common.cancel_detail')
    }
    Alert.alert(
      I18n.t('card_info.alert_title'),
      content
      ,
      [
        { text: I18n.t('card_info.cancel'), onPress: () => { }, style: 'destructive' },
        {
          text: I18n.t('card_info.ok'),
          onPress: async () => {
            console.log('bookDetail: ', bookDetail)
            const cancelResult = await apiBooking.cancelBook(bookDetail.id, 's');
            if (cancelResult.status === 'success') {
              this.updateAmount();
              DeviceEventEmitter.emit('UPDATE_BACK_TO_HOME')
              DeviceEventEmitter.emit(StaticData.UPDATE_ACTIONS)
              this.props.navigation.navigate({
                routeName: 'News',
                action: NavigationActions.navigate({ routeName: 'Home' }),
              })
              Alert.alert(I18n.t('card_info.alert_title'),
                I18n.t('card_info.alert_cancel'))
            } else {
              Alert.alert(I18n.t('common.alert_title'), cancelResult.message)
            }
          },
          style: 'default'
        }
      ],
      { cancelable: false }
    )
  }

  render() {
    const { STATUS_LOADING, STATUS_NEW, STATUS_WAIT, STATUS_PROCESS } = BookStatus
    const { bookDetail } = this.props.navigation.state.params;
    const { code_book, status, staffs, service } = bookDetail;

    return (
      <ComponentLayout navigation={this.props.navigation}>
        <View style={styles.container}>
          <Text style={styles.greenText}>{I18n.t('actions.action_detail.appointment')} {this.titleCheck()} </Text>
          <Text style={styles.listTitle}>{I18n.t('actions.action_detail.title.title')} {code_book}</Text>
          <View style={styles.line} />
          <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <Item
              title={I18n.t('actions.action_detail.service')}
              value={service.name}
            />
            {staffs.map((staff, index) => {
              if (staffs.length === 1) {
                return <Fragment key={index}>
                  <Item
                    title={`${I18n.t('actions.action_detail.staffs_name')}`}
                    value={staff.name}
                  />
                  <Item
                    title={`${I18n.t('actions.action_detail.staffs_code')}`}
                    value={staff.code_user}
                  />
                </Fragment>
              }
              return <Fragment key={index}>
                <Item
                  title={`${I18n.t('actions.action_detail.staffs_name')} ${index + 1}`}
                  value={staff.name}
                />
                <Item
                  title={`${I18n.t('actions.action_detail.staffs_code')} ${index + 1}`}
                  value={staff.code_user}
                />
              </Fragment>
            })}
            {this.data.filter(value => value.id).map(value => {
              return <Item
                id={value.id}
                key={value.id}
                isSpecial={value.id === 4}
                title={value.title}
                value={value.value}
              />
            })}
            {
              status === STATUS_NEW || status === STATUS_LOADING ?
                <Text style={[styles.greenText, { marginHorizontal: 30 * width / 375, marginTop: 7, }]}>
                  {I18n.t('actions.action_detail.title.text_wait_confirm')}
                </Text> : null
            }
            {
              status === STATUS_WAIT || status === STATUS_PROCESS ?
                <Text style={[styles.greenText, { marginHorizontal: 30 * width / 375, marginTop: 7, }]}>
                  {I18n.t('actions.action_detail.title.text_upcoming')}
                </Text> : null
            }
            {status === STATUS_NEW || status === STATUS_WAIT || status === STATUS_LOADING ?
              <View style={styles.containerFooter}>
                <RadiusButton onPress={() => this.gotochat(bookDetail)} title={I18n.t('actions.action_detail.messages')} style={{ width: 0.25 * width, height: 35 }} />
                <RadiusButton
                  onPress={this.cancelBooking}
                  backgroundColor={Colors.WHITE}
                  titleColor={Colors.GREEN}
                  title={I18n.t('actions.action_detail.exit')}
                  style={styles.cancelButton} />
              </View> :
              null
            }
          </ScrollView>
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
  },
  line: {
    alignContent: "flex-end",
    backgroundColor: Colors.GREEN,
    height: 2,
    width: 100,
    marginRight: 220,
  },
  cancelButton: {
    width: 0.25 * width,
    borderColor: Colors.GREEN,
    borderWidth: 1,
    height: 35
  },
  textDetail: {
    paddingRight: 180
  },

  itemContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
    width: width - 20,
    marginLeft: 20,
    paddingVertical: 10
  },
  title: {
    width: 160,
    fontSize: 14,
  },
  greenText: {
    color: Colors.GREEN,
    fontSize: 14,
    paddingVertical: 18,
    paddingTop: 0,
    textAlign: 'center'
  },

  listTitle: {
    width: '100%',
    color: Colors.BLACK,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 35
  },
  containerFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%'
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


exports.OrderDetail = connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
