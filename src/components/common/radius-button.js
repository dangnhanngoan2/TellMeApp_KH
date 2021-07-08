import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "tell-me-common";
import { TouchableOpacity } from "../common/touchable";
import { Image } from "../common/image";
import { Text } from "./text";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

export class RadiusButton extends Component {
  render() {
    const {
      title,
      src,
      onPress,
      backgroundColor = Colors.GREEN,
      titleColor = Colors.WHITE,
      style,
      textStyle,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.buttonContainer,
          { backgroundColor, borderColor: backgroundColor },
          style,
        ]}
      >
        {src && (
          <FastImage resizeMode="cover" style={styles.image} source={src} />
        )}
        <Text style={[styles.title, { color: titleColor }, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    width: 0.85 * width,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.GREEN,
  },

  image: {
    position: "absolute",
    left: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
  },
});
