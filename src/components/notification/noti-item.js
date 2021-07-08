import React, { Component } from "react";
import { View, Image, Dimensions, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Colors } from "tell-me-common";
import { Text } from "../common/text";
import { TouchableOpacity } from "../../components/common/touchable";
import FastImage from "react-native-fast-image";
const { width } = Dimensions.get("window");

export class NotiItem extends Component {
  render() {
    const { onPress, item } = this.props;
    const { title, body, is_read } = item;
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <FastImage
          resizeMode="contain"
          style={{
            width: is_read == 0 ? 42 : 40,
            height: is_read === 0 ? 24 : 20,
          }}
          source={
            is_read === 1
              ? require("../../assets/noNoti.png")
              : require("../../assets/noti-ms.png")
          }
        />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.text}>{title}</Text>
          <Text numberOfLines={1} style={[styles.text, { fontSize: 14 }]}>
            {body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

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
  // header: {
  //   width: '90%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginVertical: 10,
  //   borderBottomWidth: 0,
  //   paddingVertical: 5,
  //   borderColor: '#e8e8e8',
  // },
  image: {
    height: 30,
    width: 50,
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
