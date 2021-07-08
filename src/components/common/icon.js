import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// import Octicons from 'react-native-vector-icons/Octicons'
// import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import EvilIcons from 'react-native-vector-icons/EvilIcons'

export const Icon = ({ name, size = 22, color, ...rest }) => {
  switch (name) {
    case "account-tie":
      return (
        <MaterialCommunityIcons
          name="account-tie"
          {...{ size, color, ...rest }}
        />
      );
    case "account-arrow-right":
      return (
        <MaterialCommunityIcons
          name="account-arrow-right"
          {...{ size, color, ...rest }}
        />
      );
    case "content-copy":
      return (
        <MaterialCommunityIcons
          name="content-copy"
          {...{ size, color, ...rest }}
        />
      );
    case "hand-heart":
      //hand-heart
      return (
        <MaterialCommunityIcons
          name="tag-heart"
          {...{ size, color, ...rest }}
        />
      );
    case "guide":
      return (
        <MaterialCommunityIcons
          name="card-text"
          {...{ size, color, ...rest }}
        />
      );
    case "user":
      return (
        <MaterialIcons name={"person"} {...{ size: 26, color, ...rest }} />
      );
    case "email":
      return <FontAwesome name="envelope" {...{ size: 20, color, ...rest }} />;
    case "wallet":
      return <Ionicons name={"ios-wallet"} {...{ size, color, ...rest }} />;
    case "chat":
      return (
        <MaterialCommunityIcons
          name="message-alert"
          {...{ size, color, ...rest }}
        />
      );
    case "contact-us":
      return (
        <SimpleLineIcons name="earphones-alt" {...{ size, color, ...rest }} />
      );
    case "setting":
      return <MaterialIcons name="settings" {...{ size, color, ...rest }} />;
    case "newspaper":
      return <FontAwesome name="newspaper-o" {...{ size, color, ...rest }} />;
    case "info":
      return (
        <Ionicons
          name="ios-information-circle-outline"
          {...{ size, color, ...rest }}
        />
      );
    case "left":
      return (
        <MaterialCommunityIcons
          style={{ padding: 0 }}
          name="chevron-left"
          {...{ size, color, ...rest }}
        />
      );
    case "right":
      return (
        <MaterialCommunityIcons
          name="chevron-right"
          {...{ size, color, ...rest }}
        />
      );
    case "plus":
      return <AntDesign name="plus" {...{ size, color, ...rest }} />;
    case "minus":
      return <AntDesign name="minus" {...{ size, color, ...rest }} />;
    case "notification":
      return (
        <MaterialCommunityIcons name="bell" {...{ size, color, ...rest }} />
      );
    case "menu":
      return <Entypo name="menu" {...{ size, color, ...rest }} />;
    case "close":
      return <AntDesign name="close" {...{ size, color, ...rest }} />;
    case "logout":
      return <SimpleLineIcons name="logout" {...{ size, color, ...rest }} />;
    // heart
    case "heart":
      return (
        <MaterialCommunityIcons name="heart" {...{ size, color, ...rest }} />
      );
    //money
    case "money":
      return (
        <FontAwesome5 name="money-bill-wave" {...{ size, color, ...rest }} />
      );
    case "trash":
      return (
        <MaterialCommunityIcons name="delete" {...{ size, color, ...rest }} />
      );

    case "lens":
      return (
        <MaterialIcons name="lens" {...{ size, color, ...rest }} />
      );
  }
};

Icon.defaultProps = {
  size: 24,
};
