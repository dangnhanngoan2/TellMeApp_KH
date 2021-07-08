import React from "react";
import { StyleSheet, Image, Dimensions, View, Text } from "react-native";
import { TouchableOpacity } from "../../components/common/touchable";
import { Icon } from "react-native-elements";
import { Colors } from "tell-me-common";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

export const Avatar = ({ imageUrl, onOpenBottomSheet }) => {
  return (
    <TouchableOpacity onPress={onOpenBottomSheet} style={styles.container}>
      <FastImage
        resizeMode="cover"
        style={styles.logo}
        source={imageUrl ? imageUrl : null}
      />
      {!imageUrl && (
        <Icon
          name="camera-outline"
          size={80}
          color={"white"}
          type="material-community"
        />
      )}
      {/* <View style={styles.slogan}>
        <Text style={styles.text}>TM</Text>
      </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.GREEN,
    width: (100 * width) / 375,
    height: (100 * width) / 375,
    borderRadius: (50 * width) / 375,
    borderWidth: 0.5,
    borderColor: Colors.GRAY_MEDIUM,
    justifyContent: "flex-end",
    alignItems: "center",
    //justifyContent:'center',alignItems:'center',
  },
  logo: {
    position: "absolute",
    zIndex: -1,
    width: "100%",
    height: "100%",
    borderRadius: (50 * width) / 375,
  },
  slogan: {
    position: "absolute",
    bottom: -80,
    backgroundColor: Colors.GREEN,
    //left: 40,
    width: 100,
    height: 100,

    borderRadius: 100,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 11,
    color: "#fff",
    marginTop: 3,
  },
});
