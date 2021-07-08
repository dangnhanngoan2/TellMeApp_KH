import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { Colors, I18n } from "tell-me-common";
import FastImage from "react-native-fast-image";
import { Icon } from "react-native-elements";
import moment from "moment";
import { imageUrl } from "../../api/api";
import { BookColorStatus, BookStatus } from "../../common/static-data";
import { Text } from "../common/text";
import { Rating, AirbnbRating } from "react-native-ratings";
import { Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { apiBooking } from "../../api/api-booking";
import { ifIphoneX } from 'react-native-iphone-x-helper';

const { width } = Dimensions.get("window");

export const StaffItem = ({
  item,
  goToDetail,
  reBooking,
  goToChat,
  createConversation,
  loadStaffSingleConversation,
  finishSoon,
  index,
  customerId,
  goToPayments,
  amount,
}) => {
  const [showImage, setShowImage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [position, setPosition] = useState(0);
  const [tim, setTim] = useState(0);
  const [feeChat, setfeeChat] = useState(0);

  useEffect(() => {
    setTim(item.total_heart);
  }, []);

  console.log("staffs: 23", item);
  const checkReBook =
    item.status === BookStatus.STATUS_COMPLETE ||
    item.status === BookStatus.STATUS_CANCEL ||
    item.status === BookStatus.STATUS_RATE;

  const checkCreateConversation =
    item.status === BookStatus.STATUS_WAIT ||
    item.status === BookStatus.STATUS_PROCESS ||
    item.status === BookStatus.STATUS_START_MEET ||
    item.status === BookStatus.STATUS_RENEWAL;
  const titleColor = BookColorStatus[item.status]
    ? BookColorStatus[item.status]
    : BookColorStatus[5];
  console.log("AAAAAA", item.avatar + "-" + item.size);

  const marginChat = tim == null ? 0 : 1;

  const images =
    item?.portraits === null
      ? []
      : 
      [
          {
            url: imageUrl + item.portraits[0],
          },
          {
            url: imageUrl + item.portraits[1],
          },
          {
            url: imageUrl + item.portraits[2],
          },
          {
            url: imageUrl + item.portraits[3],
          },
          {
            url: imageUrl + item.portraits[4],
          },
        ];
      

  const checkConversation = async () => {
    try {
      const data = {
        customer_id: customerId,
        staff_id: item.staff_id,
      };
      console.log("checkConversation: 1111", amount);
      //const result = await apiBooking.checkExitConversation(data);
      //console.log("checkConversation: ", result);
      if (item.fee_chat < amount) {
        if (item.is_exists_conversation) {
          console.log("setfeeChat------", item.fee_chat);
          setfeeChat(item.fee_chat);
          if (item.status_conversation === "deleted") {
            createConversation(item);
          } else {
            goToChat(item);
          }
        } else {
          console.log("setfeeChat------", item.fee_chat);
          setfeeChat(item.fee_chat);
          setShowDialog(true);
        }
      } else {
        //if (result.message === "NOT_ENOUGH_MONEY") {
          Alert.alert(
            "Tài khoản không đủ Tim.",
            "Bạn muốn nạp Tim ngay chứ!",
            [
              { text: "Hủy", onPress: () => {}, style: "destructive" },
              {
                text: "Đồng ý",
                onPress: async () => {
                  console.log("TTTTTTTTTT11111-----", "TTTTTTT");
                  goToPayments(item);
                },
                style: "default",
              },
            ],
            { cancelable: false }
          );
        //}
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { marginVertical: 0, borderBottomWidth: 0 }]}
      >
        <View style={styles.header}>
          <View
            style={{
              ...styles.avatar_status_root,
              position: "relative",
              height: 60,
            }}
          >
            <View style={{ ...styles.avatar }}>
              <FastImage
                resizeMode="cover"
                key={item.staff_id}
                style={{ flex: 1 }}
                source={
                  item.avatar
                    ? { uri: imageUrl + item.avatar }
                    : require("../../assets/default-avatar.png")
                }
              />
            </View>
            <View
              style={{
                ...styles.bg_online,
                width: 12,
                height: 12,
                zIndex: 1000,
                left: 4,
                bottom: 1,
                position: "absolute",
              }}
            >
              <Icon
                name="lens"
                type="material-icons"
                color={item.online == 1 ? "#06b654" : "#A4A4A4"}
                size={10}
              />
            </View>

            <Text
              style={{
                fontSize: 12,
                color: Colors.GREEN,
                marginTop: 2,
                marginLeft: 8,
              }}
            >
              Avatar
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>
              {item.name}, {item.sex}, {item.year_old}T, {item.height}cm,{" "}
              {item.current_job}, {item.address}
            </Text>
            <Text style={styles.text}>
              {I18n.t("order_employee.employee_detail.near")}{" "}
              {item.distance < 1000
                ? Math.round(item.distance) + "m"
                : Math.round(item.distance / 1000) + "km"}
            </Text>

            <View style={styles.rateContainer}>
              <Text>{I18n.t("order_employee.employee_detail.rating")} </Text>
              <Rating
                readonly={true}
                showRating={false}
                type="star"
                startingValue={item.stars}
                size={13}
                imageSize={13}
                ratingCount={5}
              />
            </View>
          </View>
          <View style={{ alignItems: "flex-end", flex: 1 }}>
            <TouchableOpacity
              //style={{ ...styles.avatar_status_root, position: "relative" }}
              onPress={() => {
                finishSoon(item, index);
                if (amount > 1) {
                  setTim(tim + 1);
                }
              }}
            >
              <View
                style={{ ...styles.avatar_status_root, position: "relative" }}
              >
                <View style={{ ...styles.avatar_status }}>
                  <FastImage
                    resizeMode="cover"
                    key={item.staff_id}
                    style={{ flex: 1 }}
                    source={
                      item?.status?.image_url
                        ? { uri: imageUrl + item?.status?.image_url }
                        : require("../../assets/default-avatar.png")
                    }
                  />
                </View>

                <TouchableOpacity
                  style={{
                    zIndex: 1000,
                    left: -15,
                    top: "34%",
                    position: "absolute",
                  }}
                  // onPress={() => {
                  //   finishSoon(item, index);
                  //   if (amount > 1) {
                  //     setTim(tim + 1);
                  //   }
                  // }}
                >
                  <View style={{ ...styles.bg_tim }}>
                    <Text
                      style={{
                        marginRight: marginChat,
                        marginLeft: marginChat,
                        marginTop: marginChat,
                        fontSize: 10,
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "center",
                      }}
                    >
                      {tim == 0 ? "" : tim}
                    </Text>
                    <Text style={{ ...styles.text_tim }}>❤</Text>
                  </View>
                  {/* <Icon name="favorite" type="material-icons"  color="#FF0000" size={30}/> */}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <Text style={{ ...styles.textStatus, marginRight: -10 }}>
              {" "}
              {item?.status?.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.header2}>
        {item?.portraits === null ? (
          <View />
        ) : (
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              width: "95%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowImage(true);
                setPosition(0);
              }}
            >
              <Image
                style={{
                  width: 58,
                  height: 58,
                  marginEnd: 8,
                  backgroundColor: "#000000",
                }}
                source={{
                  uri: imageUrl + item.portraits[0]
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowImage(true);
                setPosition(1);
              }}
            >
              <Image
                style={{
                  width: 58,
                  height: 58,
                  marginEnd: 8,
                  backgroundColor: "#000000",
                }}
                source={{
                  uri: imageUrl + item.portraits[1]
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowImage(true);
                setPosition(2);
              }}
            >
              <Image
                style={{
                  width: 58,
                  height: 58,
                  marginEnd: 8,
                  backgroundColor: "#000000",
                }}
                source={{
                  uri: imageUrl + item.portraits[2]
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowImage(true);
                setPosition(3);
              }}
            >
              <Image
                style={{
                  width: 58,
                  height: 58,
                  marginEnd: 8,
                  backgroundColor: "#000000",
                }}
                source={{
                  uri: imageUrl + item.portraits[3]
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowImage(true);
                setPosition(4);
              }}
            >
              <Image
                style={{ width: 58, height: 58, backgroundColor: "#000000" }}
                source={{
                  uri: imageUrl + item.portraits[4]
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            width: "95%",
            justifyContent: "center",
            padding: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              checkConversation();
            }}
            style={styles.title_text}
          >
            <Text style={{ ...styles.interactive_text }}>Chat ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => reBooking(item)}
            style={{ ...styles.title_text, marginLeft: 10 }}
          >
            <Text style={{ ...styles.interactive_text }}>Đặt lịch</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showImage}
        transparent={true}
        // onRequestClose={() => {
        //   setZoomImage(false);
        // }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{
              //marginTop: 10,
              paddingHorizontal: 10,
              zIndex: 1000,
              right: 0,
              position: "absolute",
              ...ifIphoneX(
                {
                  marginTop: 40,
                },
                {
                  marginTop: 10,
                }
              ),
            }}
            onPress={() => setShowImage(false)}
          >
            <Icon name="cancel" type="material-icons" color="#FFFF" size={40} />
          </TouchableOpacity>
          <ImageViewer
            index={position}
            menus={() => {}}
            enableImageZoom={true}
            style={{ width: "100%", height: "100%" }}
            imageUrls={images}
            onSwipeDown={() => {
              setZoomImage(false);
            }}
            onChange={(index) => {
              setPosition(index);
            }}
            saveToLocalByLongPress={false}
            enableSwipeDown={true}
          />
        </View>
      </Modal>

      <Modal animationType="slide" visible={showDialog} transparent={true}>
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(52, 52, 52, 0.8)",
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>
                Bạn {item.name} rất vui khi được kết nối, bạn đồng ý tặng{" "}
                {feeChat} Tim chứ.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => loadStaffSingleConversation(item)}
                  style={styles.title_text_dialog_ok}
                >
                  <Text style={{ ...styles.interactive_text }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDialog(false)}
                  style={{ ...styles.title_text_dialog_cancel, marginLeft: 10 }}
                >
                  <Text style={{ ...styles.interactive_text }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    width: "95%",
    //alignItems: 'center',
    flexDirection: "row",
    paddingVertical: 5,
  },
  header2: {
    width: "95%",
    alignItems: "center",
    paddingVertical: 5,
  },
  button: {
    height: 27,
    backgroundColor: Colors.GREEN,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  bg_tim: {
    borderRadius: 30,
    flexDirection: "row",
    padding: 1,
    borderColor: "#F2F2F2",
    borderWidth: 0.5,
    backgroundColor: Colors.WHITE,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bg_online: {
    borderRadius: 50,
    flexDirection: "row",

    backgroundColor: Colors.WHITE,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    flexDirection: "row",
    marginRight: 20,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  avatar_status: {
    height: 60,
    width: 60,
    borderRadius: 30,
    flexDirection: "row",
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    overflow: "hidden",
  },

  avatar_status_root: {
    flexDirection: "column",
    //alignItems: 'center',
    // textAlign: 'center',
    //justifyContent:'center',
  },

  textButton: {
    color: Colors.WHITE,
    fontSize: 12,
  },
  text_tim: {
    fontSize: 12,
    marginTop: 0.5,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    paddingVertical: 5,
  },
  textStatus: {
    width: 80,
    textAlign: "center",
    fontSize: 12,
    color: Colors.ORANGE,
  },
  texttime: {
    fontSize: 12,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  interactive_text: {
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    width: 80,
    color: Colors.WHITE,
  },

  title_text: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: Colors.GREEN,
    height: 30,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 8,
    //width: 0.2 * width
  },

  title_text_dialog_ok: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.GREEN,
    height: 30,
    borderColor: Colors.GREEN,
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 8,
    //width: 0.2 * width
  },

  title_text_dialog_cancel: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A4A4A4",
    height: 30,
    borderColor: "#A4A4A4",
    borderWidth: 0.5,
    borderRadius: 15,
    marginTop: 8,
    //width: 0.2 * width
  },
};
