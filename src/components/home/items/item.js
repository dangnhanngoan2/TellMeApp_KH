import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

export const Item = ({ src, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <FastImage source={src} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
