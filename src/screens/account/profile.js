import React, { Fragment } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Text,
  Image,
} from "react-native";
import { Colors, I18n } from "tell-me-common";
import DatePicker from "react-native-date-picker";
import { connect } from "react-redux";
import moment from "moment";
import { Icon } from "react-native-elements";
import BottomSheet from "reanimated-bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CameraKitGalleryView } from "react-native-camera-kit";
import { Header } from "../../components/header/header-authen";
import { Avatar } from "../../components/common/avatar";
import ModalController from "../../components/modal-controller/modal-controller";
import { ProfileForm } from "../../components/account/profile-form";
import { TypeUser } from "../../common/static-data";
import { apiProfile } from "../../api/api-profile";
import { imageUrl } from "../../api/api";
import { updatedAuth } from "../../actions/actions-auth";
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("window");

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { auth } = props;
    const user = auth ? auth.user : null;
    this.state = {
      images: [],
      avatar: null,
      snapTop: false,
    };
  }

  editProfile = async (values) => {
    console.log("go to profile");
    const params = {
      ...values,
      sex: values.sex ? 1 : 0,
      type_id: TypeUser.customer,
    };
    if (this.state.avatar) {
      params.avatar = this.state.avatar;
    }
    console.log("params: ", params);
    const updateResult = await apiProfile.updateProfile(params);
    console.log("updateResult: ", updateResult);
    if (updateResult.status === "success") {
      Alert.alert(
        I18n.t("accounts.profile.alert_title"),
        I18n.t("accounts.profile.alert_success")
      );
      const { dispatch, auth } = this.props;
      console.log("auth: ", auth);
      dispatch(
        updatedAuth({
          ...auth,
          user: updateResult.data,
        })
      );
    } else {
      if (
        updateResult &&
        updateResult.message === "VALIDATION_FIELD_NOT_EXIST"
      ) {
        return Alert.alert(
          I18n.t("common.alert_title"),
          "Mã đại lý không tồn tại"
        );
      }
      Alert.alert(I18n.t("common.alert_title"), I18n.t("common.has_error"));
    }
  };

  updateAvatar = async () => {
    const { user } = this.props.auth;
    console.log("user:112 ", user);
    const params = {
      ...user,
      type_id: TypeUser.customer,
    };
    if (this.state.avatar) {
      params.avatar = this.state.avatar;
    }
    console.log("params: ", params);
    const updateResult = await apiProfile.updateProfile(params);
    if (updateResult.status === "success") {
      const { dispatch, auth } = this.props;
      console.log("auth: ", auth);
      dispatch(
        updatedAuth({
          ...auth,
          user: updateResult.data,
        })
      );
    } else {
      Alert.alert(I18n.t("common.alert_title"), I18n.t("common.has_error"));
    }
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
        this.updateAvatar();
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
        this.updateAvatar();
        this.bottomSheet.snapTo(2);
      }
    );
  };

  render() {
    const { auth } = this.props;
    const { user } = auth;
    console.log("useruser: ", user);
    let avatar = null;
    if (user && user.image) {
      avatar = imageUrl + user.image.image_thumb_url;
    }
    if (this.state.avatar && this.state.avatar.uri) {
      avatar = this.state.avatar.uri;
    }
    return (
      <Fragment>
        <Header
          title={I18n.t("accounts.profile.title")}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
          style={{ flex: 1 }}
        >
          <Avatar
            onOpenBottomSheet={() => {
              this.bottomSheet.snapTo(1);
            }}
            imageUrl={
              avatar ? { uri: avatar } : require("../../assets/ava.png")
            }
            callBack={(file) => {
              this.setState({ avatar: file });
            }}
          />
          <Text style={{ color: "green" }}>
            {I18n.t("accounts.profile.upload_avatar")}
          </Text>
          <ProfileForm isEdit handleSubmit={this.editProfile} profile={user} />
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
    paddingBottom: 20,
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
    elevation: 4,
    height: 45,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    // height: '100%',
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
  },
  right: {
    right: 6,
    position: "absolute",
  },
});

mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

exports.Profile = connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
