import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Clipboard,
  Share,
} from "react-native";
import { ComponentLayout } from "../../components/common/component-layout";
import { connect } from "react-redux";
import { Colors, I18n } from "tell-me-common";
import { RadiusButton } from "../../components/common/radius-button";
import { apiFeedback } from "../../api/api-feedback";
import { Text } from "../../components/common/text";
import { Icon } from "../../components/common/icon";
import FastImage from "react-native-fast-image";
const { width, height } = Dimensions.get("window");

export class Introduction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
    };
  }

  createFeedback = async () => {
    if (this.state.content.trim() === "") {
      Alert.alert(
        I18n.t("accounts.feedback.alert_title"),
        I18n.t("accounts.feedback.alert_empty")
      );
    }
    const feedbackResult = await apiFeedback.createFeedback(this.state.content);
    if (feedbackResult.status === "success") {
      console.log("feedback", feedbackResult);
      return Alert.alert(
        I18n.t("accounts.feedback.alert_title"),
        I18n.t("accounts.feedback.feedback_success")
      );
    }
  };

  copy = async () => {
    await Clipboard.setString("SHARE01");
    return Alert.alert(
      I18n.t("accounts.feedback.alert_title"),
      "Sao chép mã giới thiệu thành công"
    );
  };

  render() {
    const { content } = this.state;

    return (
      <ComponentLayout
        headerText={"Giới thiệu bạn bè"}
        rightHasNoti
        navigation={this.props.navigation}
      >
        <View style={styles.container}>
          <FastImage
            resizeMode="contain"
            style={{ height: 170 }}
            source={require("../../assets/introduction.jpg")}
          />
          <Text>
            Đưa ứng dụng đến bạn bè để tận hưởng nhiều trải nghiệm hơn bằng cách
            chia sẻ mã này để nhận ngay 100{" "}
            <Icon name="heart" size={16} color={Colors.RED} /> với mỗi lượt đăng
            ký thành công và hưởng thêm nhiều quyền lợi khác!
          </Text>
          <TouchableOpacity onPress={this.copy} style={styles.buttonStyle}>
            <Text style={{ color: Colors.GREEN }}>SHARE01</Text>
            <Icon
              containerStyle={{ marginRight: 20 }}
              size={22}
              name="content-copy"
            />
          </TouchableOpacity>
        </View>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    flex: 1,
    paddingHorizontal: 15,
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  buttonStyle: {
    height: 40,
    width: width - 30,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.GREEN,
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  content: {
    marginVertical: 10,
  },
});
