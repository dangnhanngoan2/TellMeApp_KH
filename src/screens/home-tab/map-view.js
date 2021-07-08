import React, { Component, Fragment } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
} from "react-native";
import { NavigationActions } from "react-navigation";
import BottomSheet from "reanimated-bottom-sheet";
import { connect } from "react-redux";
import { ComponentLayout } from "../../components/common/component-layout";
import { Metrics, Colors, I18n } from "tell-me-common";
import SockJS from "sockjs-client";
import { Stomp } from "stompjs/lib/stomp";
import { socketUrl } from "../../api/api";
import { apiProfile } from "../../api/api-profile";
import { saveAmount } from "../../actions/actions-user";
import { CardInfo } from "../../components/home/card-info";
import { Text } from "../../components/common/text";
import ModalManager from "../../components/modal-controller/modal-controller";
import FastImage from "react-native-fast-image";
const { height, width } = Dimensions.get("window");

const ASPECT_RATIO = Metrics.WINDOW_WIDTH / Metrics.WINDOW_HEIGHT;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 100, right: 50, bottom: 200, left: 50 };

class MapViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRegion: null,
      isMapReady: false,
      isCancel: false,
      isBottom: true,
    };
  }

  async componentDidMount() {
    // ModalManager.showToast(
    //   `Bạn vui lòng chờ đợi nhân viên trong quá trình di chuyển, hãy chat với nhân viên để biết được chi tiêt lộ trình`,
    //   10000
    // );
    this.bottomSheet && this.bottomSheet.snapTo(1);
    this.connect();
  }

  connect() {
    const { navigation } = this.props;
    const { book } = navigation.state.params;
    const socket = new SockJS(`${socketUrl}/gs-guide-websocket`);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect(
      {},
      (e) => {
        this.subscription = this.stompClient.subscribe(
          `/user/${book.id}/queue/staff-position`,
          (res) => {
            if (res.body) {
              const data = JSON.parse(res.body);
              if (this[data.staff_id] && data.latitude) {
                this[data.staff_id].setNativeProps({
                  coordinate: {
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                    latitude: data.latitude,
                    longitude: data.longitude,
                  },
                });

                this.map &&
                  this.map.fitToCoordinates(
                    [
                      {
                        latitude: parseFloat(book.latitude),
                        longitude: parseFloat(book.longitude),
                      },
                      {
                        latitude: parseFloat(data.latitude),
                        longitude: parseFloat(data.longitude),
                      },
                    ],
                    {
                      edgePadding: DEFAULT_PADDING,
                      animated: true,
                    }
                  );
              }
            }
          }
        );
      },
      (err) => this.connect()
    );
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  updateAmount = async () => {
    const { auth, dispatch } = this.props;
    if (auth) {
      const { user } = auth;
      this.subscription && this.subscription.unsubscribe();
      const profileResult = await apiProfile.getProfile(user.id);
      if (profileResult.status === "success") {
        const { data } = profileResult;
        const amount = data.wallet.amount;
        dispatch(saveAmount(amount));
      }
    }
  };

  fitTwoMarkers = () => {
    this.setState({ isMapReady: true }, () => {
      const { navigation } = this.props;
      const { book, localStaffs } = navigation.state.params;
      const { staffs } = book;
      console.log("book: ", book);
      //const { currentRegion } = this.state
      this.map.fitToCoordinates(
        [
          {
            latitude: parseFloat(book.latitude),
            longitude: parseFloat(book.longitude),
          },
          ...staffs.map((value) => {
            return {
              latitude: parseFloat(value.latitude),
              longitude: parseFloat(value.longitude),
            };
          }),
        ],
        {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        }
      );
    });
    // Fit the map screen with two points.
  };

  renderInner = (localStaffs, book) => {
    return (
      <CardInfo
        {...this.props}
        isBottom={this.state.isBottom}
        updateAmount={this.updateAmount}
        localStaffs={localStaffs}
        cancel={(isCancel) => this.setState({ isCancel })}
        book={book}
      />
    );
  };

  onClickHeader = () => {
    const { isBottom } = this.state;
    this.setState({ isBottom: !isBottom }, () => {
      // if (this.state.isBottom) {
      //   this.bottomSheet.snapTo(1);
      // } else {
      //   this.bottomSheet.snapTo(0);
      // }
    });
  };

  renderHeader = () => (
    <TouchableOpacity onPress={this.onClickHeader} style={styles.header}>
      <View style={styles.panelHeader}>
        <FastImage
          style={{
            height: 15,
            width: 14,
            transform: [{ rotate: !this.state.isBottom ? "180deg" : "0deg" }],
          }}
          source={require("../../assets/up-icon.png")}
        />
      </View>
    </TouchableOpacity>
  );

  render() {
    const { isMapReady, isCancel, isBottom } = this.state;
    const { navigation } = this.props;
    const { book, localStaffs } = navigation.state.params;
    const { staffs } = book;
    console.log("localStaffs: ", localStaffs);
    if (!book) {
      return <View />;
    }

    return (
      <ComponentLayout
        backFunction={() => {
          DeviceEventEmitter.emit("UPDATE_BACK_TO_HOME");
          this.props.navigation.navigate({
            routeName: "News",
            action: NavigationActions.navigate({ routeName: "Home" }),
          });
        }}
        noEventAmount
        navigation={navigation}
      >
        <View style={{ flex: 1, height, width }}>
          {!isCancel && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{I18n.t("map.title_success")}</Text>
            </View>
          )}
          <MapView
            ref={(ref) => (this.map = ref)}
            provider={PROVIDER_GOOGLE}
            geodesic
            minZoomLevel={2}
            maxZoomLevel={17}
            zoomEnabled
            style={styles.map}
            //onMapReady={() => this.map.animateToViewingAngle(90, 1000)}
            onLayout={() => this.fitTwoMarkers()}
            initialRegion={{
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
              latitude: book.latitude,
              longitude: book.longitude,
            }}
          >
            {isMapReady && (
              <Fragment>
                <Marker
                  ref={(ref) => (this.marker = ref)}
                  pinColor={Colors.BLUE}
                  opacity={0.7}
                  coordinate={{
                    latitude: book.latitude,
                    longitude: book.longitude,
                  }}
                />
                {(staffs.length > 0 ? staffs : localStaffs).map(
                  (value, idx) => {
                    return (
                      <Fragment key={idx}>
                        <Marker
                          description={value.name}
                          ref={(ref) => (this[value.id] = ref)}
                          pinColor={Colors.RED}
                          coordinate={{
                            latitude: value.latitude,
                            longitude: value.longitude,
                          }}
                        >
                          <FastImage
                            resizeMode="contain"
                            style={{ width: 30, height: 30 }}
                            source={require("../../assets/marker-logo.png")}
                          />
                        </Marker>
                      </Fragment>
                    );
                  }
                )}
              </Fragment>
            )}
          </MapView>
          <View style={styles.cardInfo}>
            {this.renderHeader()}
            {this.renderInner(localStaffs, book)}
          </View>
        </View>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width,
    height,
    maxHeight: height,
  },
  title: {
    color: Colors.GREEN,
    fontWeight: "400",
    textAlign: "center",
    fontSize: 14,
  },
  titleContainer: {
    alignItems: "center",
    width: 0.9 * width,
    marginLeft: 0.05 * width,
    paddingBottom: 5,
  },

  cardInfo: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginLeft: "5%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    position: "absolute",
    bottom: 10,
    width: width * 0.9,
  },
  header: {
    backgroundColor: "#fff",
    shadowColor: "#000000",
    width: "100%",
    // marginLeft: "5%",
    paddingTop: 15,
    paddingBottom: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
});

const mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

exports.MapViewScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapViewScreen);
