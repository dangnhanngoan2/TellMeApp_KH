import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Colors, I18n } from "tell-me-common";
const { width } = Dimensions.get("window");

const ChonseSelect = ({
  data,
  initValue,
  onPress,
  colorActive = "#fff",
  color = "#06b654",
  borderColor = "#06b654",
  style,
  textStyle,
  label = "",
  marginLeft = 0,
  height,
  width,
  labelStyle,
  checkStatus = false,
}) => {
  const size = Object.keys(data).length;
  return (
    <View style={{ marginLeft: marginLeft }}>
      {label != "" && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.wrapRow, style]}>
        {data.map((item, key) => {
          if (key == 0) {
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.9}
                onPress={() => onPress(item)}
                style={[
                  item.value == initValue
                    ? styles.wrapStartActive
                    : styles.wrapStart,
                  {
                    borderColor: borderColor,
                    height: height,
                    width: width,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      styles.text,
                      { color: item.value == initValue ? colorActive : color },
                      textStyle,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {checkStatus === true ? (
                    <Text style={{ ...styles.bg_online, fontSize: 6, marginTop: -6 }}></Text>
                  ) : (
                    <View />
                  )}
                </View>
              </TouchableOpacity>
            );
          } else if (key == size - 1) {
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.9}
                onPress={() => onPress(item)}
                style={[
                  item.value == initValue
                    ? styles.wrapEndActive
                    : styles.wrapEnd,
                  {
                    borderColor: borderColor,
                    height: height,
                    width: width,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: item.value == initValue ? colorActive : color },
                    textStyle,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.9}
                onPress={() => onPress(item)}
                style={[
                  item.value == initValue ? styles.wrapActive : styles.wrap,
                  {
                    borderColor: borderColor,
                    height: height,
                    width: width,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    { color: item.value == initValue ? colorActive : color },
                    textStyle,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    </View>
  );
};

module.exports = {
  ChonseSelect: ChonseSelect,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    width: 0.9 * width,
    marginBottom: 10,
    borderRadius: 7,
    alignItems: "center",
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
  },
  wrapRow: {
    flexDirection: "row",
  },
  label: {
    marginBottom: 5,
  },
  wrapStart: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "#06b654",
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapStartActive: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderColor: "#06b654",
    paddingVertical: 5,
    backgroundColor: "#06b654",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrap: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "#06b654",
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapActive: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "#06b654",
    backgroundColor: "#06b654",
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapEnd: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#06b654",
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapEndActive: {
    backgroundColor: Colors.WHITE,
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    backgroundColor: "#06b654",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#06b654",
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    paddingHorizontal: 2,
    fontSize: 13,
    color: "#383838",
  },
  bg_online: {
    width: 10,
    height: 10,
    borderRadius: 50,
    flexDirection: "row",
    padding: 4,
    fontSize: 10,
    color: Colors.WHITE,
    backgroundColor: Colors.RED,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
