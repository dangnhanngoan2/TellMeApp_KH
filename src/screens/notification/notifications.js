import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Dimensions, FlatList, Platform, ActivityIndicator, RefreshControl, Alert } from 'react-native'
import { connect } from 'react-redux'
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { apiNotification } from '../../api/api-notification'
import { setLoading } from '../../modules/progress-hud'
import { updateBadge } from '../../actions/actions-noti'
import { NotiItem } from '../../components/notification/noti-item'
const { height, width } = Dimensions.get('window')

class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      isRefreshing: false,
      loading: false
    }

    this.total_page = 0;
    this.page = 1;
  }

  componentDidMount() {
    this.getNotifications();
  }

  async getNotifications(refesh) {

    if (refesh) {
      this.setState({ isRefreshing: true });
    } else {
      this.setState({ loading: true });
    }
    const { notifications } = this.state;
    try {
      const notiResult = await apiNotification.getNotifications(this.page);
      console.log('notiResult: ', notiResult)
      this.setState({ loading: false, isRefreshing: false });
      if (notiResult.status === 'success') {
        const { data } = notiResult;
        this.total_page = notiResult.total_page;
        this.page += 1;
        if (!refesh) {
          this.setState({ notifications: this.distinctArray(notifications.concat(data)) });
        } else {
          this.setState({ notifications: this.distinctArray(data) });
        }
      }

    } catch (error) {
      this.setState({ loading: false, isRefreshing: false });
    }
  }

  async onRefresh() {
    this.page = 1;
    await this.getNotifications(true);
  }

  handleLoadMore = () => {
    const { loading } = this.state;
    if (this.total_page < this.page) {
      return;
    }
    if (!loading)
      this.getNotifications(false);
  };

  renderFooter = () => {
    const { loading, notifications } = this.state;
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


  renderLoading() {
    return <View style={styles.loading}>
      <ActivityIndicator
        style={{ color: '#000' }}
      />
    </View>

  }

  distinctArray(array) {
    return Array.from(new Set(array.map(value => value.id))).map(id => {
      return {
        ...array.find(item => item.id === id)
      }
    })
  }

  onDetail = async (item, index) => {
    try {
      const { notifications } = this.state;
      const updateResult = await apiNotification.readUpdateNoti(item.id);
      if (updateResult.status === 'success') {
        this.props.navigation.push('NotiDetails', { notification: item })
        if (item.is_read === 0) {
          const newItem = {
            ...item,
            is_read: 1
          }
          const newNotifications = [...notifications];
          newNotifications[index] = newItem;
          this.setState({ notifications: newNotifications });
          this.props.dispatch(updateBadge(this.props.notification - 1))
        }
      } else {
        Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.network_error'))
      }
    } catch (error) {
      Alert.alert(I18n.t('signup.alert_title'), I18n.t('common.network_error'))
    }
  }

  render() {
    const { notifications, isRefreshing, loading } = this.state;

    if (loading && this.page == 1) {
      return this.renderLoading()
    }
    console.log('notifications: ', notifications)
    return (
      <ComponentLayout navigation={this.props.navigation}>
        <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.list}
            extraData={this.state}
            data={this.distinctArray(notifications)}
            keyExtractor={(item, index) => item.id.toString()}
            ListFooterComponent={this.renderFooter.bind(this)}
            onEndReachedThreshold={0.4}
            onEndReached={this.handleLoadMore.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            renderItem={({ item, index }) => <NotiItem
              item={item}
              onPress={() => {
                this.onDetail(item, index)
              }} />}
          />
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
    paddingBottom:
      Platform.OS == 'ios' ? 0 : 40
  }
})

const mapStateToProps = ({ notification }) => {
  return {
    notification
  };
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

exports.Notifications = connect(mapStateToProps, mapDispatchToProps)(Notifications);