import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  DeviceEventEmitter,
  Linking,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { NavigationActions } from "react-navigation";
import { TouchableOpacity } from "../common/touchable";
import { Icon } from "react-native-elements";
import { Colors, I18n } from "tell-me-common";
import { RadiusButton } from "../../components/common/radius-button";
import { CancelItem } from "./items/cancel-item";
import { apiBooking } from "../../api/api-booking";
import { getDistance } from "../../utils/utils-geolocation";
import { Text } from "../common/text";
import { SurPlus } from "./items/surplus";
import { setLoading } from "../../modules/progress-hud";
import { CancelOther } from "./cancel-other";
import ModalController from "../modal-controller/modal-controller";
import { apiChat } from "../../api/api-chat";
import { StaticData } from "../../common/static-data";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("window");

const Item = ({ name, value, isHeart, isPayment }) => {
  const textStyle = { fontSize: 14 };

  return (
    <View style={{ width: "95%", paddingVertical: 15, flexDirection: "row" }}>
      <Text style={{ width: 100 }}>{name}</Text>
      <Text>:</Text>
      {isPayment ? (
        isHeart ? (
          <View style={styles.checkContainer}>
            <SurPlus textStyle={{ marginRight: 4 }} size={16} content={value} />
          </View>
        ) : (
          <Text style={textStyle}>{value}K</Text>
        )
      ) : (
        <Text style={{ marginLeft: 4, width: "70%" }}>{value}</Text>
      )}
    </View>
  );
};

export class CardInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBottom: true,
      isCancel: false,
      reason: null,
    };

    this.cancelData = [
      {
        id: 1,
        src: require("../../assets/cacelbooking/distance.png"),
        name: I18n.t("card_info.far"),
        style: { height: 30, width: 30 },
      },
      {
        id: 2,
        src: require("../../assets/cacelbooking/calendar.png"),
        name: I18n.t("card_info.busy"),
        style: { height: 30, width: 30 },
      },
      {
        id: 3,
        src: require("../../assets/cacelbooking/call.png"),
        name: I18n.t("card_info.unconnected"),
        style: { height: 30, width: 30 },
      },
      {
        id: 4,
        src: require("../../assets/cacelbooking/user.png"),
        name: I18n.t("card_info.time_mismatch"),
        style: { height: 30, width: 30 },
      },
      {
        id: 5,
        src: require("../../assets/cacelbooking/time.png"),
        name: I18n.t("card_info.wait_long"),
        style: { height: 30, width: 30 },
      },
      {
        id: 6,
        src: require("../../assets/cacelbooking/orther-point.png"),
        name: I18n.t("card_info.change_location"),
        style: { height: 30, width: 30 },
      },
      {
        id: 7,
        src: require("../../assets/cacelbooking/more3.png"),
        name: I18n.t("card_info.other"),
        style: { height: 7, width: 20 },
      },
    ];
  }

  cancelBooking = () => {
    const { book } = this.props;
    const { reason } = this.state;
    if (reason) {
      Alert.alert(
        I18n.t("card_info.alert_title"),
        I18n.t("card_info.alert_content"),
        [
          {
            text: I18n.t("card_info.cancel"),
            onPress: () => {},
            style: "destructive",
          },
          {
            text: I18n.t("card_info.ok"),
            onPress: async () => {
              setLoading(true);
              try {
                this.props.cancel(true);
                const cancelResult = await apiBooking.cancelBook(
                  book.id,
                  reason.name
                );
                setLoading(false);
                if (cancelResult.status === "success") {
                  console.log("cancelresult", cancelResult);
                  this.props.updateAmount();
                  Alert.alert(
                    I18n.t("card_info.alert_title"),
                    I18n.t("card_info.alert_ok")
                  );
                  DeviceEventEmitter.emit("UPDATE_BACK_TO_HOME");
                  DeviceEventEmitter.emit(StaticData.UPDATE_ACTIONS);
                  DeviceEventEmitter.emit("UPDATE_MESSAGE");
                  this.props.navigation.navigate({
                    routeName: "News",
                    action: NavigationActions.navigate({ routeName: "Home" }),
                  });
                } else {
                  Alert.alert(
                    I18n.t("common.alert_title"),
                    cancelResult.message
                  );
                }
              } catch (error) {
                setLoading(false);
                Alert.alert(I18n.t("common.alert_title"), "Network error");
              }
            },
            style: "default",
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        I18n.t("card_info.alert_title"),
        I18n.t("card_info.alert_reson")
      );
    }
  };

  onPressCancelItem = (value, index) => {
    if (value.id === 7) {
      return ModalController.show(
        <CancelOther setReason={(value) => this.setState({ reason: value })} />,
        85
      );
    }
    this.setState({ reason: value });
  };

  goToChat = (book) => {
    this.props.navigation.push("MessageDetail", { book });
  };

  renderDetail = () => {
    const { book, localStaffs } = this.props;
    const { staffs, service } = book;
    console.log("bookbook: ", book);
    const { isCancel, reason } = this.state;

    if (isCancel) {
      return (
        <Fragment>
          <Text>{I18n.t("card_info.title_cancel")}</Text>
          <ScrollView style={{ width: 0.83 * width }} horizontal={false}>
            {this.cancelData.map((value, index) => {
              const isCheck = reason && value.id === reason.id ? true : false;
              return (
                <CancelItem
                  isCheck={isCheck}
                  key={index}
                  style={value.style ? value.style : {}}
                  item={value}
                  onPress={() => this.onPressCancelItem(value)}
                />
              );
            })}
          </ScrollView>
          <RadiusButton
            style={{ width: 0.35 * width, height: 35, marginVertical: 5 }}
            onPress={this.cancelBooking}
            title={I18n.t("card_info.send_feedback")}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <ScrollView style={{ width: 0.83 * width }} horizontal={false}>
          <Text style={styles.title}>
            {I18n.t("card_info.title_booking")} {book.code_book}
          </Text>
          <Item
            name={I18n.t("card_info.service")}
            value={service ? service.name : ""}
          />
          {(staffs.length > 0 ? staffs : localStaffs).map((value, index) => {
            if (staffs.length === 1) {
              return (
                <Fragment key={index}>
                  <Item name={I18n.t("card_info.staff")} value={value.name} />
                  <Item
                    name={I18n.t("card_info.code_staff")}
                    value={value.code_user}
                  />
                </Fragment>
              );
            }
            return (
              <Fragment key={index}>
                <Item
                  name={`${I18n.t("card_info.staff")} ${index + 1}`}
                  value={value.name}
                />
                <Item
                  name={`${I18n.t("card_info.code_staff")} ${index + 1}`}
                  value={value.code_user}
                />
              </Fragment>
            );
          })}

          <Item
            name={I18n.t("card_info.time")}
            value={`${book.hour} ${I18n.t("card_info.hour")}`}
          />
          <Item
            isHeart={book.method === 1}
            isPayment
            name={I18n.t("card_info.payment")}
            value={book.amount}
          />
          <Item name={I18n.t("card_info.address")} value={book.address} />

          <Text style={styles.tipText}>{I18n.t("card_info.title")}</Text>
        </ScrollView>
        <View style={styles.containerFooter}>
          <RadiusButton
            onPress={() => this.goToChat(book)}
            title={I18n.t("card_info.message")}
            style={{ width: 0.3 * width, height: 35 }}
          />
          <RadiusButton
            onPress={() => {
              this.setState({ isCancel: true }, () => {
                this.props.cancel(true);
              });
            }}
            backgroundColor={Colors.WHITE}
            titleColor={Colors.GREEN}
            title={I18n.t("card_info.cancel")}
            style={styles.cancelButton}
          />
        </View>
      </Fragment>
    );
  };

  getTotalUnread = async () => {
    const { book } = this.props;
    try {
      const unreadResult = await apiChat.unreadConversationMessage(book.id);
      console.log("unreadResult111: ", unreadResult);
      if (unreadResult.status === "success") {
        this.setState({ messageAmount: unreadResult.data.total });
      } else {
        //Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
      }
    } catch (error) {
      //Alert.alert(I18n.t('common.alert_title'), 'Network error')
    }
  };

  componentDidMount() {
    this.getTotalUnread();
    DeviceEventEmitter.addListener("UPDATE_MESSAGE", () => {
      this.getTotalUnread();
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener("UPDATE_MESSAGE");
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isBottom !== nextProps.isBottom) {
      this.setState({ isCancel: false });
    }
  }

  render() {
    const { messageAmount } = this.state;
    const { book, localStaffs, isBottom } = this.props;
    const { staffs, latitude, longitude } = book;
    let phoneCall = "";
    let distance = null;
    if (staffs.length > 0) {
      distance = getDistance(
        latitude,
        longitude,
        staffs[0].latitude,
        staffs[0].longitude
      );
      phoneCall = staffs[0].phone;
    }

    return (
      <View style={styles.container}>
        {isBottom ? (
          <View style={styles.bottomContainer}>
            <View>
              {/* <TouchableOpacity onPress={() => this.setState({ isBottom: false }, () => {
            this.view.transition({ bottom: 10 }, { bottom: 60 * height / 667 })
          })} style={{ paddingHorizontal: 20, paddingVertical: 0 }}>
            <FastImage style={{ height: 15, width: 13 }} source={require('../../assets/up-icon.png')} />
          </TouchableOpacity> */}
              <View style={styles.itemContainer}>
                <Icon
                  containerStyle={{ marginRight: 10 }}
                  size={17}
                  type="material-community"
                  name="account-circle"
                  color={Colors.GREEN}
                />
                <Text>
                  {I18n.t("card_info.staff")}:{" "}
                  {(staffs && staffs.length > 0 ? staffs : localStaffs)
                    .map((value) => value.name)
                    .toString()}
                </Text>
              </View>
              <View style={styles.itemContainer}>
                <Icon
                  containerStyle={{ marginRight: 10 }}
                  size={18}
                  type="material-community"
                  name="map-marker"
                  color={Colors.GREEN}
                />
                <Text>
                  {I18n.t("card_info.distanced")} :{" "}
                  {distance
                    ? `${distance.value
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${distance.unit}`
                    : "0 Km"}
                </Text>
              </View>
            </View>
            <View style={styles.communication}>
              <TouchableOpacity
                style={{ paddingLeft: 10, paddingVertical: 5 }}
                onPress={() => {
                  this.setState({ messageAmount: 0 });
                  this.props.navigation.push("MessageDetail", { book });
                }}
              >
                {messageAmount > 0 && (
                  <View style={styles.badgeWrapper}>
                    <Text style={styles.badgeCount}>{messageAmount}</Text>
                  </View>
                )}
                <FastImage
                  style={styles.chatIcon}
                  source={require("../../assets/message-icon.png")}
                />
              </TouchableOpacity>
              {phoneCall && (
                <TouchableOpacity
                  style={{ paddingLeft: 10, paddingVertical: 5 }}
                  onPress={() => Linking.openURL(`tel:${phoneCall}`)}
                >
                  <FastImage
                    style={styles.chatIcon}
                    source={require("../../assets/phone-icon.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <Fragment>{this.renderDetail()}</Fragment>
        )}
      </View>
    );
  }
}

const BADGE_SIZE = 16;

const styles = StyleSheet.create({
  badgeWrapper: {
    position: "absolute",
    right: -7,
    top: 0,
    width: BADGE_SIZE,
    zIndex: 999,
    height: BADGE_SIZE,
    backgroundColor: "#f36a25",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BADGE_SIZE / 2,
  },
  badgeCount: {
    fontSize: 8,
    color: Colors.WHITE,
  },
  container: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    //position: 'absolute',
    width: "100%",
    // bottom: 10,
    zIndex: 99,
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    // marginLeft: "5%",
    maxHeight: 0.7 * height,
  },
  itemContainer: {
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontWeight: "600",
    marginBottom: 10,
  },
  tipText: {
    color: Colors.GREEN,
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButton: {
    width: 0.3 * width,
    borderColor: Colors.GREEN,
    borderWidth: 1,
    height: 35,
  },
  containerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
  chatIcon: { height: 35, width: 35 },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  communication: {},
});
