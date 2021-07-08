import qs from "querystringify";
import _ from "lodash";
import {
  Platform,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
  Linking,
} from "react-native";
import { I18n } from "tell-me-common";
import Geolocation from "react-native-geolocation-service";
import RNLocation from "react-native-location";
export const GOOGLE_DIRECTION_KEY = "AIzaSyBagjs1UxphAjHMkre0vmJUpypaWIkUPyA";
export const GOOGLE_PLACE_API_KEY = "AIzaSyCx-01W4WqcDbj1mS323TGOvpDI9Tn2nPQ";
const GOOGLE_PLACE_DETAILS = `https://maps.googleapis.com/maps/api/place/details/json?key=${GOOGLE_PLACE_API_KEY}`;
// const GOOGLE_PLACE_NEARBY_ENDPOINT = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${GOOGLE_PLACE_API_KEY}`;
const GOOGLE_PLACE_AUTOCOMPLETE = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${GOOGLE_PLACE_API_KEY}&language=vi&components=country:vn`;
const GOOGLE_PLACE_QUERYCOMPLETE = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${GOOGLE_PLACE_API_KEY}&language=vi&components=country:vn`;
const GOOGLE_GEOCODING = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_PLACE_API_KEY}&language=vi&region=VN`;
const GOOGLE_DIRECTIONS = `https://maps.googleapis.com/maps/api/directions/json?key=${GOOGLE_DIRECTION_KEY}`;

const hasLocationPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Unable to open settings");
    });
  };
  const status = await Geolocation.requestAuthorization("whenInUse");

  if (status === "granted") {
    return true;
  }

  if (status === "denied") {
    Alert.alert("Vị trí không được chấp nhận.");
  }

  if (status === "disabled") {
    Alert.alert("Bật quyền truy cập vị trí", "", [
      { text: "Cài đặt", onPress: openSetting },
      { text: "Huỷ", onPress: () => {} },
    ]);
  }

  return false;
};

export const hasLocationPermission = async () => {
  if (Platform.OS === "ios") {
    const hasPermission = await hasLocationPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show("Vị trí không được chấp nhận.", ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show("Vị trí không được chấp nhận.", ToastAndroid.LONG);
  }

  return false;
};

// {input, mode}
export const apiGeolocation = {
  getCurrentLocation: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await hasLocationPermission();
        const latestLocation = await RNLocation.getLatestLocation();

        if (latestLocation) {
          const { longitude, latitude } = latestLocation;
          resolve({ longitude, latitude });
        } else {
          reject();
        }
      } catch (error) {
        return reject(error);
      }
    });
  },

  getCurrentPlace: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        await hasLocationPermission();
        const latestLocation = await RNLocation.getLatestLocation();

        if (latestLocation) {
          const { longitude, latitude } = latestLocation;

          fetch(
            `${GOOGLE_GEOCODING}&latlng=${String(latitude)},${String(
              longitude
            )}`
          )
            .then((result) => result.json())
            .then((resp) => {
              if (resp.results) {
                resolve({
                  lat: latitude,
                  lng: longitude,
                  name: resp.results[0].formatted_address,
                });
              }
            })
            .catch(reject);
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  autoCompletePlaces: (params) => {
    return new Promise((resolve, reject) => {
      console.log(
        "uri-google: ",
        GOOGLE_PLACE_AUTOCOMPLETE + qs.stringify(params, "&")
      );
      fetch(GOOGLE_PLACE_AUTOCOMPLETE + qs.stringify(params, "&"))
        .then((result) => result.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  },

  queryCompletePlaces: (params) => {
    return new Promise((resolve, reject) => {
      fetch(GOOGLE_PLACE_QUERYCOMPLETE + qs.stringify(params, "&"))
        .then((result) => result.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  },

  geocoding: (placeName: string) => {
    return new Promise((resolve, reject) => {
      fetch(`${GOOGLE_GEOCODING}&address=${placeName}`)
        .then((r) => r.json())
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  },

  /* TRANSLATE LATITUDE, LONGITUDE TO ACTUAL LOCATION NAME */
  reverseGeocoding: (latitude: string, longitude: string) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${GOOGLE_GEOCODING}&latlng=${String(latitude)},${String(longitude)}`
      )
        .then((result) => result.json())
        .then((resp) => {
          if (resp.results) {
            resolve({
              lat: latitude,
              lng: longitude,
              name: resp.results[0].formatted_address,
            });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getPlaceDetail: (placeId: string) => {
    return new Promise((resolve, reject) => {
      fetch(`${GOOGLE_PLACE_DETAILS}&placeid=${placeId}`)
        .then((result) => result.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  },
  getDirections: (origin, destination) => {
    return new Promise((resolve, reject) => {
      const mode = "driving";
      fetch(
        `${GOOGLE_DIRECTIONS}&origin=${origin}&destination=${destination}&mode=${mode}`
      )
        .then((result) => result.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  },
};

const DEBOUNCE_VALUE = 100;

const apiGooglePlaces = {
  autoCompletePlaces: _.debounce(
    apiGeolocation.autoCompletePlaces,
    DEBOUNCE_VALUE,
    {
      leading: true,
      trailing: false,
    }
  ),

  queryCompletePlaces: _.debounce(
    apiGeolocation.queryCompletePlaces,
    DEBOUNCE_VALUE,
    {
      leading: true,
      trailing: false,
    }
  ),
  geocoding: _.debounce(apiGeolocation.geocoding, DEBOUNCE_VALUE),
  reverseGeocoding: _.debounce(
    apiGeolocation.reverseGeocoding,
    DEBOUNCE_VALUE,
    {
      leading: true,
      trailing: false,
    }
  ),
  getPlaceDetail: _.debounce(apiGeolocation.getPlaceDetail, DEBOUNCE_VALUE, {
    leading: true,
    trailing: false,
  }),
  getDirections: _.debounce(apiGeolocation.getDirections, DEBOUNCE_VALUE, {
    leading: true,
    trailing: false,
  }),
};

export { apiGooglePlaces };
