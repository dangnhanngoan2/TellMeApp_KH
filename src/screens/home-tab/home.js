import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  DeviceEventEmitter,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import BackgroundTimer from "react-native-background-timer";
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, Gradients, I18n } from "tell-me-common";
import { Header } from "../../components/header/header-layout";
import { MiniMap } from "../../components/home/mini-map";
import { RadiusButton } from "../../components/common/radius-button";
import {
  hours,
  genders,
  StaticData,
  paymentMethod,
  BookStatus,
} from "../../common/static-data";
import FastImage from "react-native-fast-image";
import { PaymentsType } from "../../components/home/payments-type";
import { DateInput } from "../../components/home/items/date-input";
import { ServiceHour } from "../../components/home/service-hour";
import { ChooseGender } from "../../components/home/choose-gender";
import { setLoading } from "../../modules/progress-hud";
import { apiBooking } from "../../api/api-booking";
import { apiChat } from "../../api/api-chat";
import { getGreetingTime, maxim } from "../../utils/utils-app-content";
import { saveAmount } from "../../actions/actions-user";
import { Text } from "../../components/common/text";
import { apiProfile } from "../../api/api-profile";
import { apiGeolocation } from "../../api/api-geolocation";
import { Icon } from "react-native-elements";
const { height, width } = Dimensions.get("window");

class Home extends Component {
  constructor(props) {
    super(props);
    (this.state = {
      price: {
        total_cash: 0,
        total_wallet: 0,
      },
      total_message: 0,
    }),
      (this.order = {
        service: null,
        gender: genders[0],
        hour: hours[0],
        address: "",
        start_time: moment()
          .add(5, "minute")
          .toDate(),
        payment_type: paymentMethod[0],
      });
  }

  updateLocation = async () => {
    const location = await apiGeolocation.getCurrentLocation();
    console.log("locationlocation: ", location);
    await apiProfile.updateProfile({
      ...location,
    });
  };

  componentDidMount() {
    Keyboard.dismiss();
    this.interval = BackgroundTimer.setInterval(() => {
      this.updateLocation();
    }, 1000 * 60);

    DeviceEventEmitter.addListener("UPDATE_BACK_TO_HOME", () => {
      this.getBookProcess();
    });
    this.getBookProcess();
  }

  componentWillUnmount() {
    if (this.interval) {
      BackgroundTimer.clearInterval(this.interval);
    }
  }

  getPrice = async (feildName, value) => {
    const { navigation } = this.props;
    let booking = null;
    let chatting = false;
    if (navigation.state.params) {
      booking = navigation.state.params.booking;
      chatting = navigation.state.params.chatting;
    }

    console.log("TTTTTT - book chatting", booking);
    if (booking) {
      if (this.order.service) {
        const priceForBook = await apiBooking.calculateBook(
          feildName === "service"
            ? value.id
            : this.order.service
            ? this.order.service.id
            : null,
          this.order.payment_type,
          chatting == false ? booking.staffs.map((value) => value.id) : booking,
          feildName === "hour" ? value.id : this.order.hour.id
        );
        console.log("priceForBook: ", priceForBook);
        if (priceForBook.status === "success") {
          this.setState({ price: priceForBook.data });
        }
      }
    }
  };

  setItem = async (value, field) => {
    this.order = {
      ...this.order,
      [field]: value,
    };
    const { navigation } = this.props;
    let isPlanning = null;
    if (navigation.state.params) {
      isPlanning = navigation.state.params.isPlanning;
    }
    if (isPlanning) {
      if (field === "service" && value !== null) {
        this.getPrice("service", value);
      }
      if (field === "hour") {
        this.getPrice("hour", value);
        DeviceEventEmitter.emit(StaticData.CHANGE_START_TIME, value);
      }
    }
  };

  async getBookProcess() {
    const totalUnreadConversationResult = await apiBooking.totalUnreadConversation();
    console.log(
      "totalUnreadConversationResult: ",
      totalUnreadConversationResult
    );
    if (totalUnreadConversationResult.status === "success") {
      console.log(
        "totalUnreadConversationResult----",
        totalUnreadConversationResult.data
      );
      if (totalUnreadConversationResult.data) {
        const data = totalUnreadConversationResult.data;
        //this.setState({ total_message: 10 });
        this.setState({ total_message: data.total });
      }
    }

    const bookProcessResult = await apiBooking.getBookProcess();
    console.log("bookProcessResult: ", bookProcessResult);
    if (bookProcessResult.status === "success") {
      if (bookProcessResult.data) {
        const book = bookProcessResult.data;
        if (book.status === BookStatus.STATUS_PROCESS) {
          //this.props.navigation.push('MapView', { book, localStaffs: [] })
        } else if (book.status === BookStatus.STATUS_LOADING) {
          this.props.navigation.push("OrderEmployee", {
            order: book,
            booking: book,
          });
        } else if (book.status === BookStatus.STATUS_START_MEET) {
          this.props.navigation.navigate("OrderDetail", { bookDetail: book });
        }
      }
    }
  }

  goToListStaff = async () => {
    const {
      service,
      address,
      gender,
      hour,
      start_time,
      payment_type,
    } = this.order;

    console.log("LLLLLL----", this.props.auth.user);
    this.props.navigation.navigate("ListStaff", {
      lat: address.location.lat,
      lng: address.location.lng,
      sex: this.props.auth.user.sex,
      u_id: this.props.auth.user.id,
      amount: this.props.user.amount
    });
  };

  updateAmount = async () => {
    const { auth, dispatch } = this.props;
    if (auth) {
      const { user } = auth;

      const profileResult = await apiProfile.getProfile(user.id);
      if (profileResult.status === "success") {
        const { data } = profileResult;
        const amount = data.wallet.amount;
        dispatch(saveAmount(amount));
      }
    }
  };

  bookSchedule = async (booking) => {
    console.log("chat111111111: ", this.order);
    const { navigation } = this.props;
    let chatting = false;
    let user_conversation = false;
    if (navigation.state.params) {
      chatting = navigation.state.params.chatting;
      user_conversation = navigation.state.params.user_conversation;
    }

    console.log("Booking-------", JSON.stringify(booking));
    console.log("chat111111111: ", chatting + "---" + user_conversation);
    const {
      service,
      address,
      gender,
      hour,
      start_time,
      payment_type,
    } = this.order;

    if (chatting) {
      let staffId = 0;
      if (user_conversation) {
        let users = booking.users;
        for (let i = 0; i < users.length; i++) {
          if (users[i].type_id === 2) {
            staffId = users[i].id;
          }
        }
      } else {
        staffId = booking.staff_id;
      }

      const payloadChatting = {
        service_id: service.id,
        gender: gender.id,
        hour: hour.value,
        address: address.formatted_address,
        latitude: address.location.lat,
        longitude: address.location.lng,
        start_time: moment(start_time).unix(),
        end_time: moment(start_time)
          .add(hour.value, "hour")
          .unix(),
        staff_id: staffId,
        method: payment_type,
      };

      console.log(
        "payloadChatting111111111: ",
        JSON.stringify(payloadChatting)
      );
      const bookingResultChatting = await apiBooking.createBookScheduleChatting(
        payloadChatting
      );
      setLoading(false);
      console.log(
        "bookingResultChatting-----: ",
        JSON.stringify(bookingResultChatting)
      );
      if (bookingResultChatting.status === "success") {
        console.log(
          "bookingResultChatting-----: ",
          JSON.stringify(bookingResultChatting)
        );
        const { auth } = this.props;
        const { user } = auth;
        const book = bookingResultChatting.data.book;
        const chat = await apiChat.createConversation(book.id, [user.id]);
        console.log("chat: ", chat);
        this.updateAmount();
        Alert.alert(
          I18n.t("home.alert_faile.title"),
          bookingResultChatting.message,
          [
            {
              text: "OK",
              onPress: async () => {
                console.log("TTTTTTTTTT11111-----", "TTTTTTT");
                this.props.navigation.navigate("Actions");
              },
              style: "default",
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          I18n.t("home.alert_faile.title"),
          bookingResultChatting.message
        );
      }
    } else {
      const payload = {
        service_id: service.id,
        gender: gender.id,
        hour: hour.value,
        address: address.formatted_address,
        latitude: address.location.lat,
        longitude: address.location.lng,
        start_time: moment(start_time).unix(),
        end_time: moment(start_time)
          .add(hour.value, "hour")
          .unix(),
        book_id: booking.id,
        method: payment_type,
      };

      const bookingResult = await apiBooking.createBookSchedule(payload);
      setLoading(false);
      if (bookingResult.status === "success") {
        const { auth } = this.props;
        const { user } = auth;
        const book = bookingResult.data.book;
        const chat = await apiChat.createConversation(book.id, [user.id]);
        console.log("chat: ", chat);
        this.updateAmount();
        Alert.alert(
          I18n.t("home.alert_faile.title"),
          bookingResult.message,
          [
            {
              text: "OK",
              onPress: async () => {
                console.log("TTTTTTTTTT11111-----", "TTTTTTT");
                this.props.navigation.navigate("Actions");
              },
              style: "default",
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(I18n.t("home.alert_faile.title"), bookingResult.message);
      }
    }
  };

  onOrder = async () => {
    const { service, address, gender, hour } = this.order;
    if (service == null) {
      return Alert.alert(
        I18n.t("home.alert_faile.title"),
        I18n.t("home.alert_faile.empty_service")
      );
    }
    if (!address) {
      return Alert.alert(
        I18n.t("home.alert_faile.title"),
        I18n.t("common.error_permission_location")
      );
    }
    try {
      setLoading(true);
      const payload = {
        service_id: service.id,
        gender: gender.id,
        hour: hour.value,
        address: address.formatted_address,
        latitude: address.location.lat,
        longitude: address.location.lng,
      };
      console.log("payload: ", payload);
      const { navigation } = this.props;
      let booking = null;
      let isPlanning = null;
      if (navigation.state.params) {
        booking = navigation.state.params.booking;
        isPlanning = navigation.state.params.isPlanning;
      }

      console.log("check_booking: ", JSON.stringify(booking));
      if (booking && isPlanning) {
        return this.bookSchedule(booking);
      }
      const bookingResult = await apiBooking.loadStaffForBook(payload);
      console.log("bookingResulttttt: ----", bookingResult);
      setLoading(false);
      if (bookingResult.status === "success") {
        this.props.navigation.push("OrderEmployee", {
          order: this.order,
          booking: bookingResult.data.book,
        });
      } else {
        Alert.alert(I18n.t("common.alert_title"), bookingResult.message);
        if (bookingResult.key === "NOT_ENOUGH_AMOUNT") {
          this.props.navigation.navigate("Payment");
        }
      }
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
    }
  };

  render() {
    console.log("configconfig----1: ", this.props.auth);
    console.log("configconfig----2: ", this.props.config);
    console.log("configconfig----3: ", this.props.user);
    const { auth, navigation, config } = this.props;
    const { currentLocation } = config;
    let isPlanning = null;
    if (navigation.state.params) {
      isPlanning = navigation.state.params.isPlanning;
    }

    const wallet = auth ? auth.user.wallet : null;
    return (
      <>
        <KeyboardAwareScrollView
          //enableAutomaticScroll
          keyboardShouldPersistTaps="handled"
          ref={(c) => {
            this.scroll = c;
          }}
          style={{ position: "relative" }}
          enableOnAndroid
          extraScrollHeight={120}
          contentContainerStyle={styles.scrollview}
        >
          <LinearGradient
            style={{
              ...styles.titleContainer,
              zIndex: -1,
              paddingBottom: 20,
            }}
            colors={Gradients.TITLE_CONTENT}
          >
            <Header
              user={auth ? auth.user : null}
              isNotification={!isPlanning}
              surPlus={wallet ? wallet.amount : 0}
              backgroundColor={Colors.TRANSPARENT}
              navigation={navigation}
              backFunction={() => this.props.navigation.navigate("Actions")}
            />
            <Text style={styles.titleColor}>
              {getGreetingTime()} {auth ? auth.user.name : ""}
            </Text>
            <Text numberOfLines={3} style={styles.content}>
              {maxim}
            </Text>
          </LinearGradient>
          <View
            style={{
              paddingHorizontal: 0.05 * width,
              width: width,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                ...styles.title_text_new,
                marginTop: -58,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: "red",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: 14,
                  marginTop: 10,
                  textAlign: "right",
                  marginRight: 2,
                }}
              >
                Khám Phá →
              </Text>
              <TouchableOpacity
                style={{ ...styles.title_text }}
                onPress={this.goToListStaff}
              >
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  <FastImage
                    resizeMode="cover"
                    key={1}
                    style={{
                      width: 74,
                      height: 76,
                      marginBottom: -36,
                      marginRight: 0,
                    }}
                    source={require("../../assets/images/ic_message.png")}
                  />

                  {this.state.total_message === 0 ? (
                    <View />
                  ) : (
                    <Text
                      style={{
                        ...styles.submitText,
                        zIndex: 1000,
                        right: 0,
                        top: -8,
                        marginRight: 4,
                        position: "absolute",
                      }}
                    >
                      {this.state.total_message}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <ServiceHour order={this.order} setItem={this.setItem} />

            <ChooseGender setItem={this.setItem} />

            {isPlanning && (
              <View style={{ width: "100%", marginTop: 20 }}>
                <Text style={styles.title}>
                  {I18n.t("home.plan.choose_time")}
                </Text>
                <DateInput setItem={this.setItem} order={this.order} />
              </View>
            )}
            <MiniMap locationApp={currentLocation} setItem={this.setItem} />
            {isPlanning && (
              <PaymentsType price={this.state.price} setItem={this.setItem} />
            )}
          </View>
        </KeyboardAwareScrollView>
        <RadiusButton
          onPress={this.onOrder}
          style={styles.buttonStyle}
          title={
            isPlanning ? I18n.t("home.plan.button") : `${I18n.t("home.button")}`
          }
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    flex: 1,
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  scrollview: {
    width: width,
    alignItems: "center",
    paddingBottom: 70,
  },
  titleColor: {
    color: Colors.GREEN_HIGH,
    paddingBottom: 7,
    fontSize: 13,
  },
  titleContainer: {
    width: "100%",
    minHeight: (160 * height) / 667,
    alignItems: "center",
  },
  buttonStyle: {
    position: "absolute",
    bottom: 15,
    marginLeft: 0.075 * width,
  },

  title: {
    fontWeight: "600",
    marginBottom: 10,
  },

  interactive_text: {
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    color: Colors.WHITE,
  },

  title_text: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "22%",
  },

  title_text_new: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    flexDirection: "row",
  },

  text_tim: {
    color: Colors.BLACK,
    marginBottom: 8,
  },
  content: {
    fontFamily: "Times New Roman",
    fontWeight: "400",
    fontSize: 17,
    marginTop: 5,
    width: "70%",
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
  },
  bg_online: {
    width: 22,
    height: 22,
    borderRadius: 50,
    flexDirection: "row",
    padding: 4,
    fontSize: 10,
    color: Colors.WHITE,
    backgroundColor: Colors.RED,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  submitText: {
    width: 22,
    height: 22,
    padding: 4,
    color: "#fff",
    textAlign: "center",
    borderRadius: 11,
    fontSize: 10,
    borderWidth: 1,
    borderColor: Colors.RED,
    backgroundColor: Colors.RED,
    overflow: "hidden",
  },
});

mapStateToProps = ({ auth, config, user }) => {
  return {
    auth,
    config,
    user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

exports.Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
