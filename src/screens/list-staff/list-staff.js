import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import { Colors, I18n } from "tell-me-common";
import { ComponentLayout } from "../../components/common/component-layout";
import { StaticData, BookStatus } from "../../common/static-data";
import { StaffItem } from "../../components/activities/staff-item";
import { apiBooking } from "../../api/api-booking";
import { apiGeolocation } from "../../api/api-geolocation";
import { ChonseSelect } from "../../utils/chonseSelect";
import SwitchSelector from "react-native-switch-selector";
import { saveAmount } from "../../actions/actions-user";
import { Icon } from "react-native-elements";

const { width } = Dimensions.get("window");
const data = [
  {
    value: 1,
    label: "Gần đây",
  },
  {
    value: 4,
    label: "Mới nhất",
  },
  {
    value: 2,
    label: "Tốt nhất",
  },
  {
    value: 3,
    label: "Ngoại ngữ",
  },
];

export class ListStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      chonseSelect: 1,
      isRefreshing: false,
      loading: false,
      sex: 0,
      search: "",
      amount: 0
    };
    this.page = 1;
    this.total_page = 1;
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const { sex, amount } = navigation.state.params;
    await this.setState({ sex: sex == 0 ? 1 : 0 , amount: amount});
    console.log("KKKKKKKKK----KKKK", this.state.sex);
    DeviceEventEmitter.addListener(StaticData.UPDATE_ACTIONS, () => {
      this.getListStaff(
        true,
        this.state.chonseSelect,
        this.state.sex,
        this.state.search
      );
    });
    this.getListStaff(
      false,
      this.state.chonseSelect,
      this.state.sex,
      this.state.search
    );
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(StaticData.UPDATE_ACTIONS);
  }

  async getListStaff(refesh, chonseSelect, sex, search) {
    if (refesh) {
      await this.setState({ isRefreshing: true, sex: sex, search: search });
    } else {
      await this.setState({ loading: true, sex: sex, search: search });
    }
    const { staffs } = this.state;
    const { navigation } = this.props;
    const { lat, lng } = navigation.state.params;
    try {
      console.log("sex-----: ", sex);
      const dataStaff = await apiBooking.getListStaff(
        chonseSelect,
        lat,
        lng,
        sex,
        search
      );
      
      console.log("dataStaff-----: ", JSON.stringify(dataStaff.data));
      if (dataStaff.status === "success") {
        console.log("success-----: ", dataStaff.data);
        this.page += 1;
        if (!refesh) {
          this.setState({
            staffs: staffs.concat(dataStaff.data),
            loading: false,
            isRefreshing: false,
          });
        } else {
          this.setState({
            staffs: dataStaff.data,
            loading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      this.setState({ loading: false, isRefreshing: false });
    }
  }

  async onRefresh() {
    this.page = 1;
    this.setState({ isRefreshing: true });
    await this.getListStaff(
      true,
      this.state.chonseSelect,
      this.state.sex,
      this.state.search
    );
    this.setState({ isRefreshing: false });
  }

  handleLoadMore = () => {
    const { loading } = this.state;
    if (this.total_page < this.page) {
      return;
    }
    if (!loading)
      this.getListStaff(
        false,
        this.state.chonseSelect,
        this.state.sex,
        this.state.search
      );
  };

  renderFooter = () => {
    const { loading } = this.state;
    if (this.total_page < this.page) {
      return null;
    }

    if (!loading) return null;
    return <ActivityIndicator style={{ color: "#000" }} />;
  };

  goToDetail = (item) => {
    const { timestamp } = item;
    const currentTime = moment().unix();
    if (
      item.status === BookStatus.STATUS_PROCESS ||
      (timestamp - currentTime <= 30 * 60 &&
        item.status === BookStatus.STATUS_WAIT)
    ) {
      return this.props.navigation.push("MapView", {
        book: item,
        localStaffs: [],
      });
    }
    this.props.navigation.navigate("OrderDetail", { bookDetail: item });
  };

  reBooking = (booking) => {
    console.log("reBooking---------", JSON.stringify(booking));
    this.props.navigation.push("BookSchedule", {
      isPlanning: true,
      booking,
      chatting: true,
      user_conversation: false,
    });
  };

  checkConversation = async (booking) => {
    const { navigation } = this.props;
    const { u_id } = navigation.state.params;
    try {
      const data = {
        customer_id: u_id,
        staff_id: booking.staff_id,
      };
      console.log("checkConversation: 1111", data);
      const result = await apiBooking.checkExitConversation(data);
      console.log("checkConversation: ", result);
      if (result.status === "success") {
      }
    } catch (error) {}
  };

  createConversation = async (booking) => {
    const { navigation } = this.props;
    const { u_id } = navigation.state.params;
    try {
      const data = {
        customer_id: u_id,
        staff_id: booking.staff_id,
      };
      console.log("createConversation: 111", data);
      const result = await apiBooking.createConversation(data);
      console.log("createConversation: ", result);
      if (result.status === "success") {
        this.props.navigation;

        this.props.navigation.navigate("Messages");
      } else {
        if (result.message === "NOT_ENOUGH_MONEY") {
          Alert.alert(
            "Tài khoản không đủ Tim.",
            "Bạn muốn nạp Tim ngay chứ!",
            [
              { text: "No", onPress: () => {}, style: "destructive" },
              {
                text: "Yes",
                onPress: async () => {
                  this.props.navigation.navigate("Payment");
                },
                style: "default",
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {}
  };

  goToPayments = (book) => {
    console.log("book; ", book);
    this.props.navigation.navigate("Payment");
  };

  loadStaffSingleConversation = async (booking) => {
    console.log("loadStaffSingleConversation---------", booking.staff_id);
    try {
      const data = {
        staff_id: booking.staff_id,
      };
      const result = await apiBooking.loadStaffSingleConversation(data);
      console.log("loadStaffSingleConversation: ", result);
      if (result.status === "success") {
        this.props.navigation.navigate("Messages");
      } else {
        console.log("createConversation: 22222", data);
      }
    } catch (error) {}
  };

  renderLoading() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator style={{ color: "#000" }} />
      </View>
    );
  }

  goToChat = (item) => {
    const book = item.conversation
    console.log("conversation----: ", JSON.stringify(book));
    //book la conversation
    this.props.navigation.navigate("MessageDetail", {
      book,
      chonseSelect: 1,
      isToList: true,
      toListStaff: true,
    });
    // console.log("book; ", book);
    // this.props.navigation.navigate("Messages");
  };

  goToDetail = async (item) => {
    const book = item.conversation
    console.log("conversation----: ", JSON.stringify(book));
    //book la conversation
    this.props.navigation.navigate("MessageDetail", {
      book,
      chonseSelect: 1,
      isToList: true
    });
  };


  goTochonseSelect = (item) => {
    this.setState({ chonseSelect: item.value, staffs: [] });
    let value =  item.value
    this.getListStaff(
      true,
      item.value,
      this.state.sex,
      this.state.search
    );
  };

  searchListStaff = () => {
    this.setState({ staffs: [] });
    this.getListStaff(
      true,
      this.state.chonseSelect,
      this.state.sex,
      this.state.search
    );
  };

  finishSoon = async (book, index) => {
    try {
      const { dispatch } = this.props;
      const result = await apiBooking.postHeart(book.staff_id);
      console.log("postHeart: ", result);
      if (result.status === "success") {
        //success
        const amount = result.data.wallet_amount;
        this.setState({amount: amount})
        dispatch(saveAmount(amount));
      } else {
        if (result.message === "NOT_ENOUGH_MONEY") {
          Alert.alert(
            "Tài khoản không đủ Tim.",
            "Bạn muốn nạp Tim ngay chứ!",
            [
              { text: "No", onPress: () => {}, style: "destructive" },
              {
                text: "Yes",
                onPress: async () => {
                  this.props.navigation.navigate("Payment");
                },
                style: "default",
              },
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  render() {
    const { staffs, loading, isRefreshing } = this.state;
    const { navigation } = this.props;
    const { u_id } = navigation.state.params;
    console.log("staffs: 1", staffs);
    return (
      <ComponentLayout numberTim={1} navigation={this.props.navigation}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                ...styles.searchSection,
                position: "relative",
                marginEnd: 8,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  flex: 1,
                  height: 34,
                  width: "90%",
                  justifyContent: "center",
                }}
                placeholder="Tên, quê, nghề, tiếng anh, trợ lý..."
                onChangeText={(searchString) => {
                  this.setState({ search: searchString });
                }}
                // underlineColorAndroid="transparent"
              />

              <TouchableOpacity
                onPress={() => {
                  this.searchListStaff();
                }}
              >
                <Icon
                  style={{
                    ...styles.searchIcon,
                    marginBottom: 8,
                    marginEnd: 8,
                    position: "absolute",
                  }}
                  name="search"
                  size={30}
                  color="#06b654"
                />
              </TouchableOpacity>
            </View>
            <SwitchSelector
              style={{
                width: 100,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                alignSelf: "flex-end",
                marginRight: 22,
                marginBottom: 8,
              }}
              height={34}
              imageStyle={{ width: 12, height: 12 }}
              fontSize={11}
              selectedTextContainerStyle={{ fontSize: 8 }}
              initial={this.state.sex}
              onPress={(value) => {
                //await this.setState({ sex: value })
                this.getListStaff(
                  true,
                  this.state.chonseSelect,
                  value,
                  this.state.search
                );
              }}
              textColor={Colors.GREEN} //'#7a44cf'
              selectedColor={Colors.WHITE}
              buttonColor={Colors.GREEN}
              borderColor={Colors.GREEN}
              hasPadding
              options={[
                { label: "Nữ", value: 1 }, //images.feminino = require('./path_to/assets/img/feminino.png')
                { label: "Nam", value: 0 }, //images.masculino = require('./path_to/assets/img/masculino.png')
              ]}
            />
          </View>

          <ChonseSelect
            height={35}
            textStyle={{ fontSize: 12 }}
            style={{ marginLeft: 20, marginBottom: 10, marginRight: 20 }}
            data={data}
            initValue={this.state.chonseSelect}
            onPress={(item) => this.goTochonseSelect(item)}
          />
          {loading && this.page == 1 ? (
            this.renderLoading()
          ) : (
            <FlatList
              contentContainerStyle={styles.list}
              keyExtractor={(item, index) => item?.staff_id.toString()}
              data={staffs}
              ListFooterComponent={this.renderFooter.bind(this)}
              onEndReachedThreshold={0.4}
              //initialNumToRender={8}
              onEndReached={this.handleLoadMore.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
              renderItem={({ item, index }) => (
                <StaffItem
                  reBooking={this.reBooking}
                  goToChat={() => this.goToChat(item)}
                  goToDetail={() => this.goToDetail(item)}
                  checkConversation={() => this.checkConversation(item)}
                  finishSoon={() => this.finishSoon(item)}
                  createConversation={() => this.createConversation(item)}
                  loadStaffSingleConversation={() =>
                    this.loadStaffSingleConversation(item)
                  }
                  index={index}
                  item={item}
                  customerId={u_id}
                  goToPayments={() => this.goToPayments(item)}
                  amount={this.state.amount}
                />
              )}
            />
          )}
        </View>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    flex: 1,
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  list: {
    marginTop: 10,
    paddingBottom: Platform.OS == "ios" ? 0 : 40,
    width: width,
    alignItems: "center",
    paddingBottom: 5,
  },
  loading: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    height: 34,
    marginStart: 20,
    marginBottom: 8,
    backgroundColor: Colors.GREEN,
    borderColor: Colors.GREEN,
    borderWidth: 1.2,
    borderRadius: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchIcon: {
    padding: 10,
    color: Colors.GREEN,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "flex-end",
  },
  input: {
    fontSize: 12,
    color: Colors.GREEN,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    color: "#424242",
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

exports.ListStaff = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListStaff);
