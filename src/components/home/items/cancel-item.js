import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import { Colors } from "tell-me-common";
import { Icon } from "react-native-elements";
import { Text } from "../../common/text";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

export const CancelItem = ({ item, onPress, style, isCheck }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FastImage resizeMode="contain" style={style} source={item.src} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        {isCheck && (
          <Icon
            color={Colors.GREEN}
            name="check-bold"
            type="material-community"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 0.8 * width,
    height: (50 * height) / 667,
  },
  textContainer: {
    borderBottomWidth: 0.5,
    borderColor: "#e8e8e8",
    paddingBottom: 8,
    width: "90%",
    height: 45,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    marginLeft: 20,
    color: Colors.BLACK,
    flex: 1,
  },
});
