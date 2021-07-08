import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, DeviceEventEmitter, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';
import FastImage from 'react-native-fast-image'
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../../components/common/radius-button'
import { Text } from '../../components/common/text'
import { apiBooking } from '../../api/api-booking'
import { apiGeolocation, apiGooglePlaces } from '../../api/api-geolocation'
import { setLoading } from '../../modules/progress-hud'
const { height, width } = Dimensions.get('window')

const InterestItem = ({ item, orderByInterest }) => {
  const { name, user = [], price, time = 2, id } = item;
  return <TouchableOpacity onPress={() => orderByInterest(id)} style={styles.item}>
    {/* <View style={styles.right}>
      <View style={styles.avatar}>
        {user.length > 0 ? user.map((staff, index) => {
          const { avatar } = staff;
          return <FastImage resizeMode='cover'
            key={staff.id}
            style={{ flex: 1 }}
            source={avatar ? { uri: avatar } :
              require('../../assets/default-avatar.png')} />
        }) :
          <FastImage resizeMode='cover'
            style={{ flex: 1 }}
            source={require('../../assets/default-avatar.png')} />}
      </View>
    </View> */}
    <View style={styles.center}>
      <Text style={styles.itemName}>{name}</Text>
    </View>
    <View style={styles.right}>
      <Text style={styles.greenText}>{price * time}Tim/{time}h</Text>
    </View>
  </TouchableOpacity>
}

class OrderByInterests extends Component {
  constructor(props) {
    super(props)
    this.state = {
      interests: [],
      currentLocation: {},
      address: ''
    }
    this.staffs = [];
  }

  async componentDidMount() {

    // lấy location hiện tại
    try {
      const currentLocation = await apiGeolocation.getCurrentLocation();
      if (currentLocation) {
        this.setState({ currentLocation });
        const currentPlace = await apiGooglePlaces.reverseGeocoding(currentLocation.latitude, currentLocation.longitude)
        if (currentPlace) {
          this.setState({ address: currentPlace.name })
        }
      }

      const { book_id } = this.props.navigation.state.params;
      const result = await apiBooking.serviceByStaff(book_id);

      if (result.status === 'success') {
        const { services, staff_ids } = result.data;
        this.staffs = staff_ids
        this.setState({ interests: services })
      }
    } catch (error) {

    }
  }

  orderByInterest = async (service_id) => {
    const { currentLocation, address, interests } = this.state;
    console.log('sasa: ', service_id,
      this.staffs, interests)
    try {
      const result = await apiBooking.loadStaffForBookInterest(
        service_id,
        this.staffs,
        currentLocation.latitude,
        currentLocation.longitude,
        ''
      );
      console.log('result: ', result)
      if (result.status === 'success') {
        this.props.navigation.navigate({
          routeName: 'News',
          action: NavigationActions.navigate({ routeName: 'Home' }),
        })
      } else {
        Alert.alert(I18n.t('common.alert_title'), result.message)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  render() {

    const { interests } = this.state;

    return (
      <ComponentLayout
        noLeft
        navigation={this.props.navigation}>
        <View style={styles.container}>
          <RadiusButton
            textStyle={{ fontSize: 20 }}
            onPress={() => {
              this.props.navigation.navigate({
                routeName: 'News',
                action: NavigationActions.navigate({ routeName: 'Home' }),
              })
            }} style={styles.buttonStyle} title={'Bỏ qua'} />
          <Text style={styles.titleContent}>Bạn muốn tiếp tục 1 cuộc hẹn khác dựa trên sở thích của Nhân viên không? Hãy hỏi ý kiến bạn ấy nhé!</Text>
          <Text style={styles.redText}>Danh sách sở thích/ khả năng của nhân viên: </Text>
          <View style={{ flex: 1, }}>
            <FlatList
              contentContainerStyle={{
                backgroundColor: '#F6F6F6',
                paddingBottom: 70,
                paddingTop: 10,
                alignItems: 'center'
              }}
              keyExtractor={(value, index) => value.id}
              data={interests}
              renderItem={({ item }) => <InterestItem orderByInterest={this.orderByInterest} item={item} />}
            />
          </View>

        </View>

      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    position: 'absolute',
    top: height - 120,
    left: 0.075 * width,
    zIndex: 99
  },
  container: {
    width: width,
    height,
    backgroundColor: '#F6F6F6',
    paddingBottom: 60,
    // alignItems: 'center'
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
    marginBottom: 7,
    fontWeight: '500',
    width: '100%',
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 10,
    color: Colors.GREEN
  },
  item: {
    width: '95%',
    paddingVertical: 15,
    flexDirection: 'row',
    paddingHorizontal: 15,
    // borderBottomColor: 'rgb(223,225,229)',
    // borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  avatar: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
    flexDirection: 'row',
    marginRight: 20,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    overflow: 'hidden'
  },

  right: {
    // height: '100%',
    // alignItems: 'center',
    // justifyContent: 'center'
  },

  center: {
    flex: 1,
    // justifyContent: 'flex-start',
    // height: '100%'
  },

  itemName: {
    fontSize: 15,
    fontWeight: '500'
  },
  greenText: {
    color: Colors.GREEN,
    textAlign: 'center',
    //marginBottom: 5
  },

  redText: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.RED,
    paddingHorizontal: 10,
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


exports.OrderByInterests = connect(mapStateToProps, mapDispatchToProps)(OrderByInterests)