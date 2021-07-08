import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { Colors, I18n } from "tell-me-common";
// import { Image } from '../../common/image'
import { Text } from "../../common/text";
import { imageUrl } from "../../../api/api";
import { sexType } from "../../../common/static-data";
import { getDistance } from "../../../utils/utils-geolocation";
import { AirbnbRating, CheckBox, Icon } from "react-native-elements";
import FastImage from "react-native-fast-image";

export const EmployeeItem = ({ item, onPress, currentLocation }) => {
  const [check, setCheck] = useState(false);
  const {
    statusDaily,
    code_user,
    sex,
    year_old,
    height,
    country,
    name,
    score,
    avatar,
    latitude,
    longitude,
    job,
    arrival_time,
  } = item;
  let status = "";
  let statusAvatar = null;
  if (statusDaily) {
    status = statusDaily.status;
    statusAvatar = statusDaily.image_url
      ? { uri: imageUrl + statusDaily.image_url }
      : null;
  }

  let distance = null;
  if (currentLocation)
    distance = getDistance(
      latitude,
      longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );
  const avatarUrl = avatar
    ? { uri: imageUrl + avatar.image_thumb_url }
    : require("../../../assets/default-avatar.png");
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(item, !check);
        setCheck(!check);
      }}
      style={[styles.container, check && styles.highlight]}
    >
      <FastImage
        isUrl
        resizeMode="cover"
        style={styles.avatar}
        source={avatarUrl}
      />
      <View style={styles.info}>
        <Text>
          {name}, {sexType[sex]}, {year_old}T, {height}cm, {job}, {country}
        </Text>
        {/* <Text></Text> */}
        <Text>
          {I18n.t("order_employee.employee_detail.near")}{" "}
          {distance ? `${distance.value}${distance.unit}` : "0Km"}
        </Text>
        <View style={styles.rateContainer}>
          <Text>{I18n.t("order_employee.employee_detail.rating")} </Text>
          <AirbnbRating
            readonly
            type="star"
            size={13}
            showRating={false}
            style={{ backgroundColor: Colors.GREEN }}
            startingValue={score}
          />
        </View>
        <Text>
          {I18n.t("order_employee.employee_detail.expected")} {arrival_time}{" "}
          {I18n.t("order_employee.employee_detail.minutes")}
        </Text>
      </View>
      <View style={[styles.info, { flex: 0.5 }]}>
        {statusAvatar && (
          <FastImage
            isUrl
            resizeMode="cover"
            style={styles.avatar}
            source={statusAvatar}
          />
        )}
        <Text style={styles.textStatus}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: Colors.GRAY_MEDIUM,
  },
  title: {
    fontSize: 12,
    marginLeft: 20,
    color: Colors.BLACK,
  },
  info: {
    flex: 1,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginRight: 20,
    borderColor: Colors.GRAY_MEDIUM,
    borderWidth: 0.5,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  check: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: "absolute",
    right: 0,
    top: 5,
  },
  highlight: {
    backgroundColor: Colors.GREEN,
  },

  textStatus: {
    fontSize: 12,
    color: Colors.ORANGE,
  },
});
