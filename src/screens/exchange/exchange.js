import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "tell-me-common";
import { ComponentLayout } from "../../components/common/component-layout";
import FastImage from "react-native-fast-image";

export class Exchange extends Component {
  render() {
    return (
      <ComponentLayout
        isNotification
        isSurPlus
        navigation={this.props.navigation}
      >
        <View style={styles.container}>
          <FastImage
            resizeMode="cover"
            style={{ flex: 1, width: "100%" }}
            source={require("../../assets/bg_tmdt.png")}
          />
        </View>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    paddingHorizontal: 15,
    textAlign: "center",
    color: Colors.GREEN,
  },
  tinyLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
});
