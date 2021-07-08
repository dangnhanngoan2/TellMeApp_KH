import React, { Fragment } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors, I18n } from "tell-me-common";
import moment from "moment";
import { Icon } from "react-native-elements";
import BottomSheet from "reanimated-bottom-sheet";
import { CameraKitGalleryView } from "react-native-camera-kit";
import { Header } from "../../components/header/header-authen";
import { apiAuth } from "../../api/api-auth";
import { Avatar } from "../../components/common/avatar";
import CameraScreen from "../../components/common/camera";
import { setLoading } from "../../modules/progress-hud";
import { ProfileForm } from "../../components/account/profile-form";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

export class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snapTop: false,
      latitude: 0,
      longitude: 0,
      cca2: "+84",
      avatar: null,
      images: [],
      data: {
        name: "",
        email: "",
        phone: "",
        latitude: 0,
        longitude: 0,
        birthday: moment()
          .subtract(29, "year")
          .format("YYYY"),
        partner_code: "",
      },
    };
  }

  setData = (values) => {
    this.setState({ data: values });
  };

  register = async (values) => {
    try {
      const { policy, phone, isSupplier } = values;
      const { longitude, latitude, avatar } = this.state;
      const numberAvaiable = await apiAuth.checkPhoneNumber(phone);
      console.log("numberAvaiable: ", numberAvaiable);
      if (numberAvaiable.data === null) {
        if (!policy) {
          return Alert.alert(
            I18n.t("signup.alert_title"),
            I18n.t("signup.alert_policy")
          );
        }

        if (!avatar) {
          return Alert.alert(
            I18n.t("signup.alert_title"),
            I18n.t("signup.alert_avatar")
          );
        }
        setLoading(true);
        let params = {
          longitude: longitude,
          latitude: latitude,
          type_id: 3,
          avatar,
          ...values,
          sex: values.sex ? 1 : 0,
        };

        const sigupInfo = await apiAuth.signup(params);
        setLoading(false);
        console.log("SIGNUPINFO : ", params);
        if (sigupInfo.status === "success") {
          const resultSend = await apiAuth.sendSms(phone);
          console.log("resultSend : ", resultSend);
          if (resultSend.status === "success") {
            Alert.alert(
              I18n.t("signup.alert_title"),
              I18n.t("signup.alert_success")
            );
            this.props.navigation.navigate("ConfirmCode", {
              info: sigupInfo.data,
            });
          } else {
            Alert.alert(
              I18n.t("signup.alert_title"),
              I18n.t("common.has_error")
            );
            // this.props.navigation.navigate('ConfirmCode', {
            //   info: sigupInfo.data
            // })
          }
        } else {
          Alert.alert(
            I18n.t("signup.alert_title"),
            I18n.t(`${sigupInfo.message}`)
          );
        }
      } else {
        Alert.alert(
          I18n.t("signup.alert_title"),
          I18n.t("signup.alert_phone_exist")
        );
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      Alert.alert(I18n.t("signup.alert_title"), I18n.t("common.network_error"));
    }
  };

  changeCountryCode = (cca2) => {
    this.setState({ cca2 });
  };

  renderInner = () => {
    const { images } = this.state;
    return (
      <View style={[styles.panel]}>
        <CameraKitGalleryView
          style={{ backgroundColor: "#242424", height: height - 70 }}
          //albumName={this.state.album}
          ref={(ref) => (this.gallery = ref)}
          minimumInteritemSpacing={0}
          minimumLineSpacing={0}
          columnCount={3}
          selectedImages={images}
          getUrlOnTapImage={true}
          selectedImageIcon={require("../../assets/images/selected.png")}
          onTapImage={this.onTapImage}
          selection={{
            selectedImage: require("../../assets/images/selected.png"),
            imagePosition: "top-right",
            imageSizeAndroid: "large",
            enable: images.length < 2,
          }}
          // fileTypeSupport={{
          //   supportedFileTypes: ['image/jpeg'],
          //   unsupportedOverlayColor: "#00000055",
          //   unsupportedImage: require('../../assets/images/unsupportedImage.png'),
          //   unsupportedTextColor: '#ff0000'
          // }}
          customButtonStyle={{
            image: require("../../assets/images/icons8-camera-64.png"),
            backgroundColor: "#242424",
          }}
          onCustomButtonPress={() => {
            this.props.navigation.navigate("CameraScreen", {
              cancel: this.onGoBack,
              cameraDone: this.cameraDone,
            });
          }}
        />
      </View>
    );
  };
  selectedImage = () => {
    this.bottomSheet.snapTo(2);
  };

  renderHeader = () => {
    const { snapTop } = this.state;
    console.log("snapTop: ", snapTop);
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} />
        <View style={styles.center}>
          <FastImage
            style={{
              height: 15,
              width: 14,
              transform: [{ rotate: snapTop ? "180deg" : "0deg" }],
            }}
            source={require("../../assets/up-icon.png")}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.bottomSheet.snapTo(2)}
          style={[styles.button, styles.right]}
        >
          <Icon name="close" type="material-community" />
        </TouchableOpacity>
      </View>
    );
  };

  onTapImage = (event) => {
    const uri = event.nativeEvent.selected;
    const newImages = [uri];
    this.setState(
      {
        images: newImages,
        avatar: {
          uri: Platform.OS === "android" ? "file://" + uri : uri,
          type: "image/jpeg",
          name: "avatar",
          isStatic: true,
        },
      },
      () => {
        this.gallery.refreshGalleryView(newImages);
        this.bottomSheet.snapTo(2);
      }
    );
  };

  onGoBack = () => {
    this.bottomSheet.snapTo(2);
  };

  cameraDone = (images) => {
    console.log("images: ", images.length);
    this.setState(
      {
        avatar: {
          uri:
            Platform.OS === "android"
              ? "file://" + images[images.length - 1].uri
              : images[images.length - 1].uri,
          type: "image/jpeg",
          name: "avatar",
          isStatic: true,
        },
      },
      () => {
        this.bottomSheet.snapTo(2);
      }
    );
  };

  render() {
    const { avatar, data } = this.state;

    return (
      <Fragment>
        <Header
          title={I18n.t("signup.title")}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
          style={{ flex: 1 }}
        >
          <Avatar
            imageUrl={avatar}
            onOpenBottomSheet={() => this.bottomSheet.snapTo(1)}
          />
          <Text style={{ color: "green" }}>{I18n.t("signup.upload")}</Text>
          <ProfileForm
            data={data}
            setData={this.setData}
            handleSubmit={this.register}
            changeCountryCode={this.changeCountryCode}
          />
        </KeyboardAwareScrollView>
        <BottomSheet
          enabledContentGestureInteraction={false}
          // enabledInnerScrolling={false}
          // enabledContentTapInteraction={false}
          onOpenStart={(e) => this.setState({ snapTop: false })}
          onOpenEnd={(e) => this.setState({ snapTop: true })}
          ref={(ref) => {
            this.bottomSheet = ref;
          }}
          snapPoints={[height - 20, height * 0.4, 0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={2}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    alignItems: "center",
  },
  panel: {
    backgroundColor: "#242424",
    height,
  },
  header: {
    backgroundColor: "#fff",
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    height: 45,
    elevation: 4,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width / 3,
    height: width / 3,
  },
  button: {
    // height: '100%',
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  circleBox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5);",
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  chilCircleBox: {
    height: 21,
    width: 21,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  panelHeader: {
    alignItems: "center",
  },
  center: {
    position: "absolute",
  },
  right: {
    right: 6,
    position: "absolute",
  },
});
