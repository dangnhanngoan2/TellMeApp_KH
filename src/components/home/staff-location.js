import React, { Component, Fragment } from "react";
import { Image, Text } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Colors } from "tell-me-common";
import BackgroundTimer from "react-native-background-timer";
import { apiStaff } from "../../api/api-staff";
import FastImage from "react-native-fast-image";
import { apiGeolocation, apiGooglePlaces } from '../../api/api-geolocation'
import Geocoder from "react-native-geocoder";

export class StaffLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      location: props.location,
      arrLocation: [],
    };
  }

  componentDidMount() {
    this.setCurrentLocation();
    this.timer = BackgroundTimer.setInterval(() => {
      this.setCurrentLocation();
    }, 1000 * 60);
  }

  componentWillUnmount() {
    if (this.timer) {
      BackgroundTimer.clearInterval(this.timer);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      console.log(
        "nextProps.location !== this.props.location: ",
        nextProps.location !== this.props.location
      );
      this.setState({ location: nextProps.location }, () => {
        this.setCurrentLocation();
      });
    }
  }

  async setCurrentLocation() {
    const { location } = this.state;
    const staffsResult = await apiStaff.staffsNear(location);

    if (staffsResult.status === "success") {
      var arr = [];
      for (var i = 0; i < staffsResult.data.length; i++) {
        var position = {
          lat: staffsResult.data[i].latitude,
          lng: staffsResult.data[i].longitude,
        };
         const ret = await Geocoder.geocodePosition(position);
         arr.push(ret[0]);
      }

      console.log("LET-------", arr);
      this.setState({ staffs: staffsResult.data, arrLocation: arr }, () => {
        this.props.fitTwoMarkers(this.state.staffs);
      });
    }
  }

  render() {
    const { staffs, arrLocation } = this.state;

    return (
      <Fragment>
        {(arrLocation.length > 0 ? arrLocation : []).map((value, idx) => {
          return (
            <Fragment key={idx}>
              <Marker
                description={value.formattedAddress}
                pinColor={Colors.RED}
                coordinate={{
                  latitude: value.position.lat,
                  longitude: value.position.lng,
                }}
              >
                <FastImage
                  resizeMode="contain"
                  style={{ width: 30, height: 30 }}
                  source={require("../../assets/marker-logo.png")}
                />
                <Callout>
                  <Text style={{width: 100}}>{value.formattedAddress}</Text>
                </Callout>
              </Marker>
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}
