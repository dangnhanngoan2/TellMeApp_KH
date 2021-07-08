import React from "react";
import { View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { Colors, I18n } from "tell-me-common";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { imageUrl } from "../../api/api";
import { Icon } from "../../components/common/icon";
import { Text } from "../common/text";

const { width } = Dimensions.get("window");

export const MessageItem = ({
  item,
  onPress,
  outConversation,
  chonseSelect,
}) => {
  let last_message = "";
  let last_time = "";
  let last_time_string = "";
  let date1 = "";
  let date2 = "";
  let type = "";
  let fontW = "";
  const { messages, users } = item;
  if (messages.length > 0) {
    last_message = messages[0].content;
    last_time = moment().diff(moment(messages[0].created_at), "day");
    last_time_string = `${last_time} ${I18n.t("message.day_ago")}`;
    if (last_time === 0) {
      last_time = moment().diff(moment(messages[0].created_at), "hour");
      last_time_string = `${last_time} ${I18n.t("message.hour_ago")}`;
    }
    if (last_time === 0) {
      last_time = moment().diff(moment(messages[0].created_at), "minute");
      last_time_string = `${last_time} ${I18n.t("message.minute_ago")}`;
    }
    if (last_time === 0) {
      last_time = moment().diff(moment(messages[0].created_at), "second");
      last_time_string = `${last_time} ${I18n.t("message.seconds_ago")}`;
    }
    if (messages[0].content.length > 18) {
      const length = messages[0].content.length;
      last_message = messages[0].content.substring(0, length - 4) + "...";
    }
  }

  //console.log("TIIIIII_______", JSON.stringify(item));
  const userList = users.filter((value) => value.type_id === 2);
  const userListCustomer = users.filter((user) => user.type_id === 3);

  if (userListCustomer.length > 0) {
    userListCustomer.map((user, index) => {
      const { pivot } = user;
      date1 = pivot.read_datetime;
      date2 = item?.messages[0]?.created_at;
      type = date1 > date2 ? "#808080" : "#000000";
      fontW = date1 > date2 ? "normal" : "bold";
    });
  }

  return (
    <TouchableOpacity style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, flexDirection: "row" }}
      >
        <View style={{ ...styles.avatar }}>
          {userList.length > 0 ? (
            userList.map((user, index) => {
              const { avatar } = user;
              return (
                <FastImage
                  key={index}
                  style={{ flex: 1 }}
                  source={
                    avatar
                      ? { uri: imageUrl + avatar.image_thumb_url }
                      : require("../../assets/default-avatar.png")
                  }
                />
              );
            })
          ) : (
            <FastImage
              resizeMode="cover"
              style={{ flex: 1 }}
              source={require("../../assets/default-avatar.png")}
            />
          )}
        </View>
        <View
          style={{
            ...styles.bg_online,
            width: 12,
            height: 12,
            zIndex: 1000,
            left: 4,
            bottom: 1,
            position: "absolute",
          }}
        >
          {userList.length > 0 ? (
            userList.map((user, index) => {
              const { online } = user;
              return (
                <Icon
                  color={online == 1 ? "#06b654" : "#A4A4A4"}
                  name="lens"
                  size={10}
                />
              );
            })
          ) : (
            <Icon color="#A4A4A4" name="lens" size={10} />
          )}
        </View>

        {/* <View style={styles.avatar}>
        {
          userList.length > 0 ? userList.map((user, index) => {
            const { avatar } = user;
            return <FastImage
              key={index}
              style={{ flex: 1 }}
              source={avatar ? { uri: imageUrl + avatar.image_thumb_url } : require('../../assets/default-avatar.png')} />
          }) : <FastImage resizeMode='cover'
            style={{ flex: 1 }}
            source={require('../../assets/default-avatar.png')} />}
      </View> */}
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.text}>
            {I18n.t("message.employee_name")}:{" "}
            {chonseSelect == 1
              ? item.status == "waiting"
                ? "Chờ xác nhận"
                : userList.map((value) => value.name).toString()
              : userList.length > 0
              ? userList.map((value) => value.name).toString()
              : "Chờ xác nhận"}
          </Text>

          {userListCustomer.length > 0 ? (
            userListCustomer.map((user, index) => {
              // const { pivot } = user;
              // const date1 = new Date(pivot.read_datetime);
              // const date2 = new Date(item?.messages[0]?.created_at);
              // const type = date1 > date2 ? "#808080" : "#000000";
              // const fontW = date1 > date2 ? "normal" : "bold";

              return (
                <Text
                  numberOfLines={1}
                  style={{ ...styles.text, color: type, fontWeight: fontW }}
                >
                  {last_message}
                </Text>
              );
            })
          ) : (
            <Text numberOfLines={1} style={{ ...styles.text, fontSize: 14 }}>
              {last_message}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={{ height: "100%", alignItems: "flex-end" }}>
        <Text style={[styles.greenText]}>{last_time_string}</Text>
        <Icon
          onPress={() => outConversation(item.id)}
          color={Colors.LIGHT_GREY}
          name="trash"
          size={24}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    backgroundColor: Colors.WHITE,
    width: width,
    paddingHorizontal: 0.05 * width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderColor: Colors.LIGHT_GREY,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 20,
    overflow: "hidden",
    flexDirection: "row",
    borderColor: Colors.GRAY_SEMILIGHT,
    borderWidth: 0.5,
  },

  bg_online: {
    borderRadius: 50,
    flexDirection: "row",

    backgroundColor: Colors.WHITE,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  greenText: {
    color: Colors.GREEN,
    fontSize: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    paddingVertical: 5,
  },
};
