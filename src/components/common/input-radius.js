import React, { Component } from "react";
import {
  StyleSheet,
  Keyboard,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Colors } from "tell-me-common";
import { Input, Icon } from "react-native-elements";
import { Text } from "./text";

const { width, height } = Dimensions.get("window");

export class RadiusInput extends Component {
  handleChange = (value) => {
    this.props.onChange(this.props.name, value);
    this.props.handleSubmit && this.props.handleSubmit(this.props.name, value);
  };

  render() {
    const {
      placeholder = "",
      style,
      icon,
      error,
      onPress,
      titleNoRequire,
    } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={{ alignItems: "flex-end" }}>
        <Input
          leftIcon={
            icon && (
              <Icon
                name={icon}
                size={24}
                color={Colors.GREYISH_BROWN}
                type="material-community"
              />
            )
          }
          onTouchStart={onPress}
          leftIconContainerStyle={{ marginLeft: 5 }}
          inputStyle={{
            paddingLeft: 10,
            borderWidth: 0,
            fontSize: 13,
            borderBottomWidth: 0,
            color: "#000",
          }}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          containerStyle={[styles.container, style]}
          placeholder={placeholder}
          onChangeText={this.handleChange}
          {...this.props}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: 0.85 * width,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.GREYISH_BROWN,
    borderWidth: 0.5,
    marginBottom: 3,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
  },

  error: {
    color: Colors.RED,
    fontSize: 12,
    right: 10,
    position: "absolute",
    bottom: -16,
  },
});
