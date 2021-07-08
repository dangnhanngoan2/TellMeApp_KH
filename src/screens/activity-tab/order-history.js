import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, FlatList, Platform, ActivityIndicator, RefreshControl, DeviceEventEmitter, Alert } from 'react-native'
import moment from 'moment'
import { Colors, I18n } from 'tell-me-common'
import { ComponentLayout } from '../../components/common/component-layout'
import { StaticData, BookStatus } from '../../common/static-data'
import { OrderItem } from '../../components/activities/order-item'
import { apiBooking } from '../../api/api-booking'
import { NavigationEvents } from "react-navigation";
const { width } = Dimensions.get('window')

export class OrderHistory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      books: [],
      isRefreshing: false,
      loading: false
    }

    this.page = 1;
    this.total_page = 1;
  }

  async componentDidMount() {
    // DeviceEventEmitter.addListener(StaticData.UPDATE_ACTIONS, () => {
    //   this.getBookHistory(true);
    // })
    // this.getBookHistory(false);
  }

  async getDataHistory() {
    DeviceEventEmitter.addListener(StaticData.UPDATE_ACTIONS, () => {
      this.getBookHistory(true);
    })
    this.getBookHistory(false);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(StaticData.UPDATE_ACTIONS)
  }

  async getBookHistory(refesh) {
    if (refesh) {
      this.setState({ isRefreshing: true });
    } else {
      this.setState({ loading: true });
    }
    const { books } = this.state;
    try {
      const bookHistoryResult = await apiBooking.getBookHistory(this.page);
      console.log('bookHistoryResult: ', bookHistoryResult)
      if (bookHistoryResult.status === 'success') {
        this.total_page = bookHistoryResult.total_page;
        this.page += 1;
        if (!refesh) {
          this.setState({ books: books.concat(bookHistoryResult.data), loading: false, isRefreshing: false });
        } else {
          this.setState({ books: bookHistoryResult.data, loading: false, isRefreshing: false });
        }
      }

    } catch (error) {
      this.setState({ loading: false, isRefreshing: false });
    }
  }

  async onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true });
    await this.getBookHistory(true);
    this.setState({ isRefreshing: false });
  }

  handleLoadMore = () => {
    const { loading } = this.state;
    if (this.total_page < this.page) {
      return;
    }
    if (!loading)
      this.getBookHistory(false);
  };

  renderFooter = () => {
    const { loading } = this.state;
    if (this.total_page < this.page) {
      return null;
    }

    if (!loading) return null;
    return (
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    );
  };

  goToDetail = (item) => {
    const { timestamp } = item;
    const currentTime = moment().unix();
    if (item.status === BookStatus.STATUS_PROCESS
      || (timestamp - currentTime <= 30 * 60 && item.status === BookStatus.STATUS_WAIT)) {
      return this.props.navigation.push('MapView', { book: item, localStaffs: [] })
    }
    this.props.navigation.navigate('OrderDetail', { bookDetail: item })
  }

  reBooking = (booking) => {
    this.props.navigation.push('BookSchedule', { isPlanning: true, booking })
  }

  deleteBooking = async (booking) => {
    try {
      const result = await apiBooking.hideBooking(booking.id);
      console.log('result: ', result)
      if (result.status === 'success') {
        //success
        const { books } = this.state;
        this.setState({ books: books.filter(value => value.id !== booking.id) })
        Alert.alert(I18n.t('common.alert_title'), I18n.t('common.delete_success'))
      } else {
        Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
      }
    } catch (error) {
      Alert.alert(I18n.t('common.alert_title'), I18n.t('common.network_error'))
    }
  }

  renderLoading() {
    return <View style={styles.loading}>
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    </View>

  }

  goToChat = (book) => {
    console.log('book; ', book)
    this.props.navigation.push('MessageDetail', { book })
  }

  finishSoon = (book, index) => {
    Alert.alert(
      I18n.t('common.alert_title'),
      I18n.t('common.finish_soon_content'),
      [
        {
          text: I18n.t('accounts.setting.logout.cancel'),
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: I18n.t('common.ok'), onPress: async () => {
            try {
              const result = await apiBooking.finishSoon(book.id);
              console.log('result: ', result)
              if (result.status === 'success') {
                //success
                const { books } = this.state;
                const newBooks = [...books];
                newBooks[index] = {
                  ...book,
                  status: 5
                }
                this.setState({ books: newBooks })
                Alert.alert(I18n.t('common.alert_title'), I18n.t('common.finish_soon'))
              } else {
                Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
              }
            } catch (error) {
              console.log('error: ', error)
              Alert.alert(I18n.t('common.alert_title'), I18n.t('common.network_error'))
            }
          }
        },
      ])
  }
  render() {
    const { books, loading, isRefreshing } = this.state;
    console.log('books: ', books)
    return (
      <ComponentLayout isNotification navigation={this.props.navigation}>
        <View style={styles.container}>
        <NavigationEvents
            onWillFocus={(payload) => this.onRefresh()}
            onDidFocus={(payload) => console.log("did focus", payload)}
            onWillBlur={(payload) => console.log("will blur", payload)}
            onDidBlur={(payload) => console.log("did blur", payload)}
          />
          {loading && this.page == 1 ? this.renderLoading() :
            <FlatList
              contentContainerStyle={styles.list}
              keyExtractor={(item, index) => item.id.toString()}

              data={books}
              ListFooterComponent={this.renderFooter.bind(this)}
              onEndReachedThreshold={0.4}
              onEndReached={this.handleLoadMore.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
              renderItem={({ item, index }) => <OrderItem
                reBooking={this.reBooking}
                goToChat={() => this.goToChat(item)}
                goToDetail={() => this.goToDetail(item)}
                deleteBooking={this.deleteBooking}
                finishSoon={this.finishSoon}
                index={index}
                item={item}
              />}
            />
          }
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
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  list: {
    marginTop: 10,
    paddingBottom: Platform.OS == 'ios' ? 0 : 40,
    width: width,
    alignItems: 'center',
    paddingBottom: 5
  },
  loading: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
