import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  Alert,
  DeviceEventEmitter,
  ActivityIndicator,
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { ComponentLayout } from "../../components/common/component-layout";
import { Colors, I18n } from "tell-me-common";
import { apiChat } from "../../api/api-chat";
import { apiBooking } from "../../api/api-booking";
import { MessageItem } from "../../components/message/message-item";
const { width } = Dimensions.get("window");
import { ChonseSelect } from "../../utils/chonseSelect";

const data = [
  {
    value: 1,
    label: "Trò chuyện",
  },

  {
    value: 2,
    label: "Chat booking",
  },
];

export class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isRefreshing: false,
      chonseSelect: 1,
      loading: false,
      total_message: false,
    };

    this.onRefresh = this.onRefresh.bind(this);
  }

  async componentDidMount() {
    // this.getConversationList();
    // DeviceEventEmitter.addListener("UPDATE_MESSAGE_LIST", () => {
    //   this.getConversationList();
    // });
  }

  async getConversationList() {
    const totalUnreadConversationResult = await apiBooking.totalUnreadConversation();
    console.log(
      "totalUnreadConversationResult: ",
      totalUnreadConversationResult
    );
    if (totalUnreadConversationResult.status === "success") {
      if (totalUnreadConversationResult.data) {
        const data = totalUnreadConversationResult.data;
        const check = data.total === 0 ? false : true;
        console.log("totalUnreadConversationResult----", data.total);
        this.setState({ total_message: check });
      }
    }

    this.setState({ loading: true });
    if (this.state.chonseSelect == 1) {
      const messagesResultUser = await apiChat.userConversationList();

      const getNumberMessage = await apiChat.unreadSingleConversationMessage();
      console.log("messagesResultUser: ", JSON.stringify(messagesResultUser));
      if (messagesResultUser.status === "success") {
        this.setState({ messages: messagesResultUser.data, loading: false });
      } else {
        this.setState({ loading: false });
        Alert.alert(I18n.t("common.alert_title"), messagesResult.message);
      }
    } else {
      const messagesResult = await apiChat.conversationList();
      console.log("messagesResult: ", messagesResult);
      if (messagesResult.status === "success") {
        this.setState({ messages: messagesResult.data, loading: false });
      } else {
        this.setState({ loading: false });
        Alert.alert(I18n.t("common.alert_title"), messagesResult.message);
      }
    }
  }

  goToDetail = async (book) => {
    console.log("conversation: ", book);
    //book la conversation
    this.props.navigation.navigate("MessageDetail", {
      book,
      chonseSelect: this.state.chonseSelect,
      isToList: true,
      resetListChat: this.onRefresh,
    });
  };

  goTochonseSelect = async (item) => {
    await this.setState({ chonseSelect: item.value });
    this.getConversationList();
  };

  async onRefresh() {
    this.setState({ isRefreshing: true });
    if (this.state.chonseSelect == 1) {
      const messagesResultUser = await apiChat.userConversationList();
      console.log("messagesResultUser: ", JSON.stringify(messagesResultUser));
      if (messagesResultUser.status === "success") {
        this.setState({ messages: messagesResultUser.data });
      } else {
        Alert.alert(I18n.t("common.alert_title"), I18n.t("common.has_error"));
      }
    } else {
      const messagesResult = await apiChat.conversationList();
      console.log("messagesResult: ", messagesResult);
      if (messagesResult.status === "success") {
        this.setState({ messages: messagesResult.data });
      } else {
        Alert.alert(I18n.t("common.alert_title"), I18n.t("common.has_error"));
      }
    }

    this.setState({ isRefreshing: false });
  }

  renderLoading() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator style={{ color: "#000" }} />
      </View>
    );
  }

  outConversation = (conversation_id) => {
    Alert.alert(
      "Bạn có chắc chắn muốn rời khỏi cuộc trò chuyện này?",
      "",
      [
        { text: "Hủy", onPress: () => {}, style: "destructive" },
        {
          text: "Đồng ý",
          onPress: async () => {
            const { messages } = this.state;
            console.log(
              "singleOutConversation: ",
              conversation_id + "--" + this.state.chonseSelect
            );

            const messagesResult =
              this.state.chonseSelect == 1
                ? await apiChat.singleOutConversation(conversation_id)
                : await apiChat.outConversation(conversation_id);
            console.log("messagesResult: ", messagesResult);

            if (messagesResult.status === "success") {
              this.setState({
                messages: messages.filter(
                  (value) => value.id !== conversation_id
                ),
              });
            } else {
              Alert.alert(
                I18n.t("common.alert_title"),
                I18n.t("common.has_error")
              );
            }
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    const { messages, isRefreshing } = this.state;
    const { loading, total_message } = this.state;
    return (
      <ComponentLayout isNotification navigation={this.props.navigation}>
        <View style={styles.container}>
          <NavigationEvents
            onWillFocus={(payload) => this.getConversationList()}
            onDidFocus={(payload) => console.log("did focus", payload)}
            onWillBlur={(payload) => console.log("will blur", payload)}
            onDidBlur={(payload) => console.log("did blur", payload)}
          />
          <ChonseSelect
            height={35}
            width={"50%"}
            textStyle={{ fontSize: 12 }}
            style={{ marginLeft: 20, marginBottom: 10, marginRight: 20 }}
            data={data}
            checkStatus={total_message}
            initValue={this.state.chonseSelect}
            onPress={(item) => this.goTochonseSelect(item)}
          />
          {loading ? (
            this.renderLoading()
          ) : (
            <FlatList
              contentContainerStyle={styles.list}
              keyExtractor={(value, index) => index.toString()}
              data={messages}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.onRefresh.bind(this)}
                />
              }
              renderItem={({ item }) => (
                <MessageItem
                  outConversation={this.outConversation}
                  item={item}
                  chonseSelect={this.state.chonseSelect}
                  onPress={() => this.goToDetail(item)}
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
  },
  header: {
    paddingHorizontal: 0.04 * width,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderBottomWidth: 0,
  },
  loading: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
