import React, { useState } from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Colors } from "tell-me-common";
import { Text } from "../../common/text";

export const GenderItem = ({ item, onPress, isCheck }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={styles.container}
    >
      <FastImage
        resizeMode="contain"
        style={{ width: 22, height: 27 }}
        source={isCheck ? item.srcCheck : item.srcUnCheck}
      />
      <Text
        style={[styles.title, { color: isCheck ? Colors.GREEN : Colors.NOBEL }]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 13,
    marginLeft: 20,
    fontWeight: "600",
    color: Colors.NOBEL,
  },
});
