import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Dimensions,
  Platform,
  AsyncStorage,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, I18n } from "tell-me-common";
import { TouchableOpacity } from "../components/common/touchable";
import { connect } from "react-redux";
import { RadiusButton } from "../components/common/radius-button";
import { RadiusInput } from "../components/common/input-radius";
import { updateAuthData } from "../actions/actions-auth";
import { saveAmount } from "../actions/actions-user";
import { setLoading } from "../modules/progress-hud";
import { apiAuth } from "../api/api-auth";
import { cache } from "../utils/cache";
import FastImage from "react-native-fast-image";

const { height, width } = Dimensions.get("window");
class Login extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      phone: "",
      pinCode: "",
    };
    this.user_id = null;
  }

  async componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      const { auth } = navigation.state.params;
      if (auth && auth.token) {
        const { user } = auth;
        this.setState({ isLogin: false, phone: user.phone });
      }
    }
  }

  goToSignup = () => {
    this.props.navigation.push("Signup");
  };

  loginWithPhone = async () => {
    try {
      setLoading(true);
      const cachedIds = cache.getIds() != null ? cache.getIds() : "abc" ;
      console.log("TOKEN_FIREBASE: ", cachedIds);
      const { dispatch } = this.props;
      const { phone, pinCode } = this.state;
      const loginInfo = await apiAuth.login(
        phone,
        pinCode,
        cachedIds ? cachedIds.userId : null
      );
      if (loginInfo.data && loginInfo.data.token) {
        let amount = 0;
        const { user } = loginInfo.data;
        if (user) {
          amount = user.wallet.amount;
        }
        console.log("loginInfo: ", loginInfo);
        dispatch(updateAuthData(loginInfo.data, phone));
        dispatch(saveAmount(amount));
        this.props.navigation.push("News");
      } else {
        setLoading(false);
        Alert.alert(
          I18n.t("login.alert_title"),
          I18n.t("login.alert_pin_code")
        );
      }
    } catch (error) {
      Alert.alert(I18n.t("login.alert_title"), I18n.t("login.alert_not_code"));
      setLoading(false);
    }
  };

  goToPincode = async () => {
    const { phone } = this.state;
    if (phone) {
      try {
        setLoading(true);
        const numberAvaiable = await apiAuth.checkPhoneNumber(phone);
        setLoading(false);
        console.log("numberAvaiable: ", numberAvaiable);
        if (numberAvaiable.message === "SUCCESS") {
          this.user_id = numberAvaiable.data.user_id;
          if (numberAvaiable.data.is_active === 0) {
            const resultSend = await apiAuth.sendSms(phone);
            if (resultSend.status === "success") {
              return this.props.navigation.navigate("ConfirmCode", {
                info: numberAvaiable.data,
              });
            }
          }
          if (numberAvaiable.data.has_pin_code === false) {
            this.props.navigation.navigate("CreatePin", {
              info: numberAvaiable.data,
            });
          } else {
            this.setState({ isLogin: false });
          }
        } else {
          return Alert.alert(
            I18n.t("login.alert_title"),
            I18n.t("login.alert_phone")
          );
        }
      } catch (error) {
        setLoading(false);
        return Alert.alert(
          I18n.t("login.alert_title"),
          I18n.t("common.network_error")
        );
      }
    } else {
      return Alert.alert(
        I18n.t("login.alert_title"),
        I18n.t("login.alert_not_phone")
      );
    }
  };

  exitAccount = () => {
    const { dispatch } = this.props;
    this.setState({ isLogin: true });
    dispatch(updateAuthData(null, ""));
  };

  goToForgotPinCode = async () => {
    try {
      setLoading(true);
      const resultSend = await apiAuth.sendSms(this.state.phone);
      setLoading(false);
      if (resultSend.status === "success") {
        return this.props.navigation.push("ConfirmCode", {
          info: {
            phone: this.state.phone,
            user_id: this.user_id,
          },
          isForgotPinCode: true,
        });
      } else {
        return Alert.alert(I18n.t("login.alert_title"), resultSend.message);
      }
    } catch (error) {
      setLoading(false);
      return Alert.alert(
        I18n.t("login.alert_title"),
        I18n.t("common.network_error")
      );
    }
  };

  onChangePinCode = (text) => {
    if (text.length === 4) {
      return this.setState({ pinCode: text }, () => {
        this.loginWithPhone();
      });
    }

    return this.setState({ pinCode: text });
  };

  render() {
    const { isLogin, phone, pinCode } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <FastImage
          resizeMode="contain"
          style={styles.logo}
          source={require("../assets/login/logo.png")}
        />
        {isLogin && (
          <Fragment>
            {/* <Text style={styles.textContent}>{I18n.t('login.greeting_login')}</Text> */}
            <RadiusInput
              icon={"phone"}
              value={phone}
              keyboardType="number-pad"
              onChangeText={(text) => this.setState({ phone: text })}
              style={styles.input}
              placeholder={I18n.t("login.enter_phone")}
            />
            <RadiusButton
              onPress={this.goToPincode}
              style={styles.buttonStyle}
              title={I18n.t("login.button")}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <Text style={styles.textContent}>
              {I18n.t('login.not_account')}
            </Text> */}
              <RadiusButton
                backgroundColor={Colors.ORANGE}
                onPress={this.goToSignup}
                style={styles.buttonStyle}
                title={I18n.t("login.register")}
              />
              {/* <TouchableOpacity style={{ marginLeft: 3, paddingVertical: 5 }} onPress={this.goToSignup} >
              <Text style={[styles.textContent, { color: Colors.GREEN }]}>
                {I18n.t('login.register')}
              </Text>
            </TouchableOpacity> */}
            </View>
          </Fragment>
        )}

        {!isLogin && (
          <Fragment>
            <Text style={styles.textContent}>
              {I18n.t("login.greeting_pin_code")}
            </Text>
            <RadiusInput
              maxLength={4}
              keyboardType="number-pad"
              secureTextEntry
              value={pinCode}
              icon={"lock"}
              onChangeText={this.onChangePinCode}
              style={styles.input}
              placeholder={I18n.t("login.enter_pin_code")}
            />
            <RadiusButton
              onPress={this.loginWithPhone}
              style={styles.buttonStyle}
              title={I18n.t("login.button")}
            />
            <View style={styles.containerOption}>
              <Text
                onPress={this.goToForgotPinCode}
                style={{ color: Colors.BLACK }}
              >
                {I18n.t("login.forgot_pincode")}
              </Text>
              <Text onPress={this.exitAccount} style={{ color: Colors.BLACK }}>
                {I18n.t("login.logout_account")}
              </Text>
            </View>
          </Fragment>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //paddingBottom: 20,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    //height: height
  },
  viewModal: {
    width: 200,
    height: 150,
  },
  viewlineModal: {},
  textModal: {
    fontSize: 20,
    color: Colors.BLACK,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop: Platform.OS == "ios" ? (60 * height) / 667 : (40 * height) / 667,
    width: 70,
    height: 100,
  },

  textContent: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.BLACK,
    marginTop: (30 * height) / 667,
  },

  buttonStyle: {
    marginTop: (25 * height) / 667,
  },
  input: {
    marginTop: (35 * height) / 667,
  },
  containerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 0.85 * width,
    marginTop: 20,
  },
});

exports.Login = connect()(Login);
