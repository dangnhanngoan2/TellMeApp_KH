import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  DeviceEventEmitter,
  TouchableOpacity,
  Text,
} from "react-native";
import { Colors } from "tell-me-common";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";
import SockJS from "sockjs-client";
import { Stomp } from "stompjs/lib/stomp";
import { connect } from "react-redux";
import { Header } from "../../components/header/header-authen";
import { ChatInput } from "../../components/message/chat-input";
import { apiChat } from "../../api/api-chat";
import { socketUrl, socketUrlNew, imageUrl } from "../../api/api";
import { stringify } from "querystringify";
const { width } = Dimensions.get("window");

class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      conversation: null,
    };
  }

  getStaffs() {
    const { book, isToList, chonseSelect } = this.props.navigation.state.params;
    let staffs = [];


    if (book) {
      if (isToList) {
        staffs = book.users;
      } else {
        staffs = book.staffs;
      }
    }
    console.log("MessageDetail-------", JSON.stringify(staffs));
    return staffs;
  }

  reBooking = () => {
    const { book } = this.props.navigation.state.params;
    let booking = book
    console.log("reBooking---------", JSON.stringify(booking))
    this.props.navigation.push("BookSchedule", {
      isPlanning: true,
      booking,
      chatting: true,
      user_conversation : true
    });
  };

  async componentDidMount() {
    const { book, isToList, chonseSelect} = this.props.navigation.state.params;
    console.log("THis is Props", this.props.navigation);
    console.log("book------", JSON.stringify(book));

    const { auth } = this.props;
    const { user } = auth;
    if (book) {
      let book_id = 1;
      let staffs = [];
      if (chonseSelect == 1) {
        book_id = book.code;
      } else {
        if (isToList) {
          book_id = book.book_id;
        } else {
          book_id = book.id;
          console.log("book------id", book.id);
        }
      }

      let users = book.users;
      let customerId = 0;
      let staffId = 0;
      let customer = book.customer;
      if(users){
        for (let i = 0; i < users.length; i++) {
          if (users[i].type_id === 3) {
            customerId = users[i].id;
          
          } else if (users[i].type_id === 2) {
            staffId = users[i].id;
          }
        }
      }else {
        if(customer){
          customerId = book.customer.id
        }else{
          customerId = book.customer_id
        }
        staffId = book.staffs.id
      }

      // for (let i = 0; i < users.length; i++) {
      //   if (users[i].type_id === 3) {
      //     customerId = users[i].id;
      //   } else if (users[i].type_id === 2) {
      //     staffId = users[i].id;
      //   }
      // }
      console.log("customerId------", customerId + "----" + staffId);

      staffs = this.getStaffs();
      this.connect(book_id);
      const createdConver =
        chonseSelect == 1
          ? await apiChat.createSingleConversation(customerId, staffId)
          : await apiChat.createConversation(
              book_id,
              staffs.concat(user).map((value) => value.id)
            );

      console.log("createdConver: ", createdConver);
      if (createdConver.status === "success") {
        const messages = createdConver.data.messages
          ? createdConver.data.messages
          : [];
        this.setState({
          conversation: createdConver.data,
          messages: messages.reverse().map((value, index) => {
            return {
              _id: value.id,
              createdAt: moment(value.updated_at).toDate(),
              text: value.image_url ? null : value.content,
              image: value.image_url ? imageUrl + value.image_url : null,
              user: {
                _id: value.sender_id.toString(),

                avatar: value.avatar
                  ? imageUrl + value.avatar.image_thumb_url
                  : null,
              },
            };
          }),
        });
      }
    }
  }

  connect(book_id) {

    const { chonseSelect } = this.props.navigation.state.params;
    console.log("chonseSelect-----connect", chonseSelect);
    const socket =
      chonseSelect == 1
        ? new SockJS(`${socketUrlNew}/gs-guide-websocket`)
        : new SockJS(`${socketUrl}/gs-guide-websocket`);
    this.stompClient = Stomp.over(socket);
    let stomSocket =
      chonseSelect === 1
        ? `/user/${book_id}/queue/single-chat`
        : `/user/${book_id}/queue/chat`;
    console.log("stomSocket-------------", stomSocket);

    this.stompClient.connect(
      {},
      (e) => {
        this.subscription = this.stompClient.subscribe(stomSocket, (data) => {
          let messageResult = JSON.parse(data.body);
          console.log("messageResult: ", JSON.stringify(messageResult));
          this.setState({
            messages: GiftedChat.append(
              this.state.messages,
              messageResult,
              true
            ),
          });
        });
      },
      (err) => this.connect(book_id)
    );
  }

  async componentWillUnmount() {
    const { book, isToList, chonseSelect , toListStaff} = this.props.navigation.state.params;
    const { conversation } = this.state;
    console.log("book: ", book);
    console.log("conversation------: ", conversation);
    if (book) {
      let book_id = 1;

      if (chonseSelect == 1) {
        book_id = book.code;
      } else {
        if (isToList) {
          book_id = book.book_id;
        } else {
          book_id = book.id;
        }
      }
      this.stompClient && chonseSelect == 1
        ? this.stompClient.unsubscribe(`/user/${book_id}/queue/single-chat`)
        : this.stompClient.unsubscribe(`/user/${book_id}/queue/chat`);
      this.subscription && this.subscription.unsubscribe();
      try {
        chonseSelect == 1
          ? await apiChat.updateReadDatetimeConversationSingle(
              book.pivot.single_conversation_id
            )
          : await apiChat.updateReadDatetimeConversation(conversation.id);
      } catch (error) {}
    }
  }

  onSend = async (message) => {
    const { auth, navigation } = this.props;
    const { book, isToList, chonseSelect } = navigation.state.params;
    const { conversation } = this.state;
    const { user } = auth;
    let book_id = null;

    console.log("book: ", book);
    console.log("chonseSelect: ", chonseSelect);

    if (chonseSelect == 1) {
      book_id = book.code;

      const messageResult = await apiChat.saveMessageSingle({
        sender_id: user.id,
        content: message.text || "image",
        single_conversation_id: book.pivot.single_conversation_id,
        image: message.image,
      });

      console.log("messageResult: ", messageResult);
      if (messageResult.status === "success") {
        this.stompClient.send(
          "/app/single-chat",
          {},
          JSON.stringify({
            ...message,
            image: messageResult.data.image_url
              ? imageUrl + messageResult.data.image_url
              : null,
            code: book_id,
          })
        );
      }
    } else {
      console.log("isToList: ", isToList);
      if (isToList) {
        book_id = book.book_id;
      } else {
        book_id = book.id;
        console.log("book_id: ", book.id);
      }

      const messageResult = await apiChat.saveMessage({
        sender_id: user.id,
        content: message.text || "image",
        conversation_id: conversation.id,
        image: message.image,
      });

      console.log("messageResult: ", messageResult);
      if (messageResult.status === "success") {
        this.stompClient.send(
          "/app/chat",
          {},
          JSON.stringify({
            ...message,
            image: messageResult.data.image_url
              ? imageUrl + messageResult.data.image_url
              : null,
            book_id: book_id,
          })
        );
      }
    }
  };

  onSend1 = (message = []) => {
    console.log("messages1102: ", message);
    this.setState({
      messages: GiftedChat.append(this.state.messages, { ...message }, true),
    });
  };

  render() {
    const { auth, navigation } = this.props;
    const { chonseSelect } = navigation.state.params;
    const { user } = auth;
    const { messages } = this.state;
    const { avatar } = user;
    console.log("messages: ", messages);
    return (
      <Fragment>
        <View style={{ flexDirection: "column" }}>
          <Header
            backFunction={async () => {
              const { conversation } = this.state;
              const {
                book,
                resetListChat,
                chonseSelect,
              } = this.props.navigation.state.params;
              try {
                if (resetListChat) {
                  chonseSelect == 1
                    ? await apiChat.updateReadDatetimeConversationSingle(
                        book.pivot.single_conversation_id
                      )
                    : await apiChat.updateReadDatetimeConversation(
                        conversation.id
                      );
                  resetListChat();
                  DeviceEventEmitter.emit("UPDATE_MESSAGE");
                }
                this.props.navigation.goBack();
              } catch (error) {
                if (resetListChat) {
                  resetListChat();
                }
                this.props.navigation.goBack();
              }
            }}
            title={this.getStaffs()
              .map((empl) => empl.name)
              .toString()}
            navigation={this.props.navigation}
          />

          {chonseSelect === 1 ? (
            <TouchableOpacity
              onPress={() => this.reBooking()}
              style={{
                ...styles.title_text,
                marginLeft: 10,
                marginTop: -40,
                marginRight: 10,
              }}
            >
              <Text style={{ ...styles.interactive_text }}>Đặt lịch</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>

        <GiftedChat
          scrollToBottomOffset={500}
          scrollToBottom
          isCustomViewBottom
          messages={messages}
          renderInputToolbar={({ user, messageIdGenerator }) => {
            return (
              <ChatInput
                messageIdGenerator={messageIdGenerator}
                user={user}
                onSend={this.onSend}
              />
            );
          }}
          keyboardShouldPersistTaps="never"
          user={{
            _id: user.id.toString(),
            avatar: imageUrl + avatar.image_thumb_url,
          }}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    backgroundColor: "#e2e9f1",
    flex: 1,
    width: width,
    height: "100%",
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  list: {
    backgroundColor: "#e2e9f1",
    marginTop: 10,
    paddingBottom: 10,
  },

  inputContainer: {
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 0.5,
    borderRadius: 20,
    marginBottom: 10,
  },
  interactive_text: {
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    width: 80,
    color: Colors.WHITE,
  },

  title_text: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 5,
    backgroundColor: Colors.GREEN,
    height: 30,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 8,
    //width: 0.2 * width
  },
});

mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

exports.MessageDetail = connect(mapStateToProps)(MessageDetail);
