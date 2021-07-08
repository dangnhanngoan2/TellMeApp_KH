import React from "react";
import { View, Image, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import { Colors } from "tell-me-common";
import { imageUrl } from "../../api/api";
import { Text } from "../common/text";

const { width } = Dimensions.get("window");

export const MessagerItem = ({ item, onPress, user }) => {
  console.log("item111: ", item);
  const checkMe = user ? user.id === item.user_id : false;
  const { avatar } = item;

  return (
    <View
      onPress={onPress}
      style={[
        styles.container,
        { justifyContent: !checkMe ? "flex-start" : "flex-end" },
      ]}
    >
      {!checkMe && (
        <FastImage
          resizeMode="cover"
          style={styles.avatar}
          //{ backgroundColor: checkMe ? '#d6f1fe' : '#fff' }
          source={
            avatar
              ? { uri: imageUrl + avatar }
              : require("../../assets/default-avatar.png")
          }
        />
      )}
      <View
        style={[
          styles.messegerContent,
          { backgroundColor: checkMe ? "#d6f1fe" : "#fff" },
        ]}
      >
        <Text style={styles.text}>{item.message}</Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: "#e2e9f1",
    width: width,
    paddingHorizontal: 0.05 * width,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 7,
  },
  messegerContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: 0.65 * width,
    // minHeight: 50
  },

  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  greenText: {
    color: Colors.GREEN,
    fontSize: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    color: Colors.BLACK,
  },
};
