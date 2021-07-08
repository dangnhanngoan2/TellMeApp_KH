import React, { Component, Fragment } from "react";
import {
  StatusBar,
  DeviceEventEmitter,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import RNLocation from "react-native-location";
import codePush from "react-native-code-push";
import { setCustomTextInput } from "react-native-global-props";
import { request, PERMISSIONS, check } from "react-native-permissions";
import OneSignal from "react-native-onesignal"; // Import package from node modules
import { Provider } from "react-redux";
import { Colors, I18n } from "tell-me-common";
import { PersistGate } from "redux-persist/integration/react";
import SplashScreen from "react-native-splash-screen";
import { configureStore } from "./stores/custom-store";
import { push } from "./actions/actions-navigation";
import StackNavigator from "./navigations/stack-navigator";
import { setAppNavigator } from "./utils/navigation-helper";
import { updateAuthData } from "./actions/actions-auth";
import { updateBadge } from "./actions/actions-noti";
import { saveAmount } from "./actions/actions-user";
import { setLocation } from "./actions/actions-config";
import { apiProfile } from "./api/api-profile";
import { apiBooking } from "./api/api-booking";
import { getMaxim } from "./utils/utils-app-content";
import { switchLanguage } from "./common/localization/i18n";
import {
  StaticData,
  NotificationType,
  setLocationNow,
} from "./common/static-data";
import { cache } from "./utils/cache";
import { apiGeolocation } from "./api/api-geolocation";

setCustomTextInput({
  style: { color: "#000000" },
});

const { store, persistor } = configureStore();
export { store };

type Props = {};

class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.loaded = false;
    this.state = {
      loading: false,
    };
    getMaxim();
    
    //this.getENV();
  }

  onReceived = (notification) => {
    this.handleNotification(notification);
  };

  onOpened = (openResult) => {
    this.handleNotification(openResult.notification);
  };

  async UNSAFE_componentWillMount() {
    if (Platform.OS === "android") {
      await this.requestExternalStoreageRead();
    } else {
      const checss = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (checss !== "granted") {
        await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      }
    }

    this.getCurrentLocation();
  }

  getCurrentLocation = async () => {
    try {
      const currentLocation = await apiGeolocation.getCurrentLocation();
      if (currentLocation) {
        const currentPlace = await apiGeolocation.reverseGeocoding(
          currentLocation.latitude,
          currentLocation.longitude
        );
        if (currentPlace) {
          store.dispatch(
            setLocation({
              formatted_address: currentPlace.name,
              location: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
            })
          );
        }
      }
    } catch (error) {}
  };

  async requestExternalStoreageRead() {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ],
        {
          title: "TellMe",
          message:
            "Chúng tôi yêu cầu quyền truy cập thư viện ảnh, camera (App needs access to external storage)",
        }
      );

      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      Alert.alert(
        I18n.t("signup.alert_title"),
        "Bạn đã từ chối truy cập ảnh, chúng tôi yêu cầu bạn vào phần cài đặt của máy để cấu hình lại."
      );
      return false;
    }
  }

  componentDidMount() {
    OneSignal.init("5244e4df-90db-4da1-91e1-4ed964c0d051", {
      kOSSettingsKeyAutoPrompt: true,
    });

    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("ids", (data) => {
      cache.setIds(data);
    });
    OneSignal.configure();
    OneSignal.enableSound(true);
    OneSignal.inFocusDisplaying(2);
    DeviceEventEmitter.addListener(
      StaticData.EVENT_SET_LOADING_OVERLAY,
      (isLoading) => this.setState({ loading: isLoading })
    );

    RNLocation.configure({ distanceFilter: 1 });

    // codePush.sync({
    //   updateDialog: {
    //     optionalIgnoreButtonLabel: "Đóng",
    //     optionalInstallButtonLabel: "Cài đặt",
    //     optionalUpdateMessage:
    //       "Bản cập nhật mới khả dụng. Bấm cài đặt để cập nhật phiên bản mới!",
    //     title: "Phiên bản mới",
    //   },
    //   installMode: codePush.InstallMode.IMMEDIATE,
    // });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(StaticData.EVENT_SET_LOADING_OVERLAY);
    OneSignal.removeEventListener("ids");
    OneSignal.removeEventListener("received");
    OneSignal.removeEventListener("opened");
  }

  checkNavigationScreen = () => {
    const { state } = this.navigator;
    const routes = state.nav.routes;
    console.log("state: ", state);
    const routeName = routes[state.nav.index].routeName;
    return routeName !== "Login" && routeName !== "Signup";
  };

  checkActionTab = () => {
    const { state } = this.navigator;
    const routes = state.nav.routes;
    const routeName = routes[state.nav.index].routeName;
    if (routeName === "News") {
      const tabIndex = routes[state.nav.index].index;
      if (tabIndex === 1) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  updateAmount = async () => {
    const { auth } = store.getState();
    if (auth) {
      const { user } = auth;
      const profileResult = await apiProfile.getProfile(user.id);
      if (profileResult.status === "success") {
        const { data } = profileResult;
        const amount = data.wallet.amount;
        store.dispatch(saveAmount(amount));
      }
    }
  };

  handleNotification = async (notification) => {
    const { payload } = notification;
    const { additionalData } = payload;
    if (!additionalData) {
      return;
    }

    const notiData = additionalData.data;
    if (!notiData) {
      return;
    }

    console.log("NOTI----",JSON.stringify(notiData))
    switch (notiData.type) {
      case NotificationType.STATUS_PROCESS_INTEREST:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            apiBooking
              .getStaffInBook(notiData.book_id)
              .then((result) => {
                if (result.status === "success") {
                  this.navigator.dispatch(
                    push("MapView", { book: result.data, localStaffs: [] })
                  );
                  Alert.alert(I18n.t("common.alert_title"), notiData.body);
                }
              })
              .catch((e) => {});
          }
        }
        break;
      case NotificationType.STAFF_CONFIRM_SCHEDULE:
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        if (this.navigator) {
          this.updateAmount();
          DeviceEventEmitter.emit(StaticData.UPDATE_ACTIONS);
        }
        break;
      case NotificationType.STATUS_CANCEL:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            this.updateAmount();
            this.navigator.dispatch(push("News", { isPlanning: false }));
            Alert.alert(I18n.t("common.alert_title"), notiData.body);
          }
        }
        break;
      case NotificationType.STATUS_START_MEET:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            this.navigator.dispatch(push("News", { isPlanning: false }));
            Alert.alert(I18n.t("common.alert_title"), notiData.body);
          }
        }
        break;
      case NotificationType.STAFF_ARRIVE:
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        break;
      case NotificationType.STATUS_STAFF_OUT:
        this.updateAmount();
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        break;
      case NotificationType.STATUS_COMPLETE:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            this.navigator.dispatch(push("Review", { book: notiData.book_id }));
          }
        }
        break;
      case NotificationType.BEFORE_COMPLETE:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            this.navigator.dispatch(
              push("TimeExtention", { book: notiData.book_id })
            );
            Alert.alert(I18n.t("common.alert_title"), notiData.body);
          }
        }
        break;
      //STATUS_BOOK_TIME_OUT
      case NotificationType.STATUS_BOOK_TIME_OUT:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            this.updateAmount();
            Alert.alert(I18n.t("common.alert_title"), notiData.body);
          }
        }
        break;
      case NotificationType.STATUS_REFUND:
        if (this.navigator) {
          if (this.checkNavigationScreen()) {
            DeviceEventEmitter.emit(StaticData.UPDATE_ACTIONS);
            this.updateAmount();
            Alert.alert(I18n.t("common.alert_title"), notiData.body);
          }
        }
        break;
      case NotificationType.STATUS_NEW_MESSAGE:
        const { state } = this.navigator;
        const routes = state.nav.routes;
        const routeName = routes[state.nav.index].routeName;
        if (routeName === "MessageDetail") {
          return;
        }
        DeviceEventEmitter.emit("UPDATE_MESSAGE");
        DeviceEventEmitter.emit("UPDATE_MESSAGE_LIST");
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        break;
      case NotificationType.ADMIN_NOTIFICATION:
        this.updateBadge();
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        break;

      default:
        Alert.alert(I18n.t("common.alert_title"), notiData.body);
        break;
    }
  };

  updateBadge = () => {
    const { notification } = store.getState();
    this.updateAmount();
    store.dispatch(updateBadge(notification + 1));
  };

  onBeforeLift() {
    this.refreshAuth();
  }

  refreshAuth() {
    const { auth, config } = store.getState();
    if (config) {
      switchLanguage(config.language);
    }
    if (auth && store) {
      store.dispatch(updateAuthData(auth));
    }
    setTimeout(() => {
      this.loaded = true;
      this.forceUpdate();
      SplashScreen.hide();
    }, 1500);
  }

  render() {
    const { loading } = this.state;
    const { auth } = store.getState();
    return (
      <Fragment>
        <StatusBar backgroundColor={Colors.GREEN} barStyle="light-content" />
        {loading && (
          <View style={StyleSheet.absoluteFill}>
            <ActivityIndicator />
          </View>
        )}
        <Provider store={store}>
          <PersistGate
            persistor={persistor}
            onBeforeLift={() => this.onBeforeLift()}
          >
            {this.loaded ? (
              <StackNavigator
                auth={auth}
                ref={(ref) => {
                  this.navigator = ref;
                  if (auth && ref) {
                    ref.dispatch(push("Login", { auth }));
                  }
                  setAppNavigator(ref);
                }}
              />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />
              </View>
            )}
          </PersistGate>
        </Provider>
      </Fragment>
    );
  }
}

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};

export default codePush(codePushOptions)(App);
