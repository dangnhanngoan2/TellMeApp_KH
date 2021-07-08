import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { ComponentLayout } from "../../components/common/component-layout";
import { connect } from "react-redux";
import { Colors, I18n } from "tell-me-common";
import { StaticData } from "../../common/static-data";
import { AccountItem } from "../../components/account/account-item";
import { Avatar } from "../../components/common/avatar";
import { imageUrl } from "../../api/api";
import { apiSetting } from "../../api/api-setting";
import { apiProfile } from "../../api/api-profile";
const { height, width } = Dimensions.get("window");

export class Account extends Component {
  constructor() {
    super();
    this.state = {
      link_web_partner: "",
      link_web_tell_me: "",
    };
  }

  async componentDidMount() {
    try {
      const linkResult = await apiSetting.getLink();
      if (linkResult.status === "success") {
        const { data } = linkResult;
        this.setState({
          ...data,
        });
      }
    } catch (error) {}
  }

  updateToPartner = async () => {
    Alert.alert(
      "Thông báo",
      "Bạn vui lòng xác nhận yêu cầu nâng cấp lên đại lý!",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              const result = await apiProfile.updateToPartner();
              console.log("resultresultresult: ", result);
              if (result.status === "success") {
                Alert.alert("Thông báo", "Gửi yêu cầu thành công");
              } else {
                //"Yêu cầu đã được gửi"
                Alert.alert(
                  "Thông báo",
                  "Yêu cầu của bạn đã tồn tại trên hệ thống"
                );
              }
            } catch (error) {}
          },
        },
      ]
    );
  };

  render() {
    const data = [
      {
        id: 6,
        iconName: "account-arrow-right",
        title: I18n.t("accounts.agency.title"),
        direction: "Wallet",
      },
      {
        id: 1,
        iconName: "user",
        title: I18n.t("accounts.profile.title"),
        direction: "Profile",
      },

      {
        id: 2,
        iconName: "wallet",
        title: I18n.t("accounts.wallet.title"),
        direction: "Wallet",
      },

      {
        id: 3,
        iconName: "setting",
        title: I18n.t("accounts.setting.title"),
        direction: "Setting",
      },
      {
        id: 4,
        iconName: "guide",
        title: I18n.t("accounts.guide.title"),
        direction: "Guide",
      },
      {
        id: 5,
        iconName: "email",
        title: I18n.t("accounts.feedback.title"),
        direction: "Feedback",
      },
      {
        id: 8,
        iconName: "account-tie",
        title: "Nâng cấp lên đại lý",
        direction: "Introduction",
      },
      {
        id: 7,
        iconName: "hand-heart",
        title: "Cập nhật bản mới",
        direction: "Introduction",
      },
    ];
    const { auth } = this.props;
    console.log("auth: ", auth);
    const user = auth ? auth.user : null;
    let avatar = null;
    if (user && user.image) {
      avatar = imageUrl + user.image.image_thumb_url;
    }

    const { link_web_partner, link_web_tell_me } = this.state;

    return (
      <ComponentLayout isNotification navigation={this.props.navigation}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
        >
          <Avatar
            imageUrl={
              avatar ? { uri: avatar } : require("../../assets/ava.png")
            }
            noSelect
          />
          <View style={{ marginTop: 30 }}>
            {data.map((value) => {
              return (
                <AccountItem
                  key={value.id}
                  onPress={() => {
                    if (value.id === 6) {
                      return Linking.openURL(link_web_partner);
                    } else if (value.id === 7) {
                      return Linking.openURL(link_web_tell_me);
                    } else if (value.id === 8) {
                      return this.updateToPartner();
                    }
                    this.props.navigation.navigate(value.direction);
                  }}
                  iconName={value.iconName}
                  title={value.title}
                />
              );
            })}
          </View>
        </ScrollView>
      </ComponentLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    //flex: 1
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  scrollview: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 0.05 * width,
    paddingBottom: Platform.OS == "ios" ? 80 : 100,
  },
  header: {
    paddingHorizontal: 0.04 * width,
    backgroundColor: Colors.WHITE,
    justifyContent: "space-between",
    borderBottomWidth: 0,
  },
  changeTab: {
    flexDirection: "row",
    height: (60 * height) / 667,
    width: width,
    paddingLeft: (30 * width) / 375,
    backgroundColor: "#fff",
    paddingTop: 10,
    // alignItems: 'center'
  },
  bottomTab: { width: 0.35 * width, height: 30 },
});

mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

exports.Account = connect(mapStateToProps)(Account);
