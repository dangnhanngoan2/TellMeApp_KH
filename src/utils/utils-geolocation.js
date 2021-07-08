import RNLocation from 'react-native-location'
import { getDistance as getDistanceGeoLib } from 'geolib';

RNLocation.configure({
  distanceFilter: 5.0 // Meters
  // desiredAccuracy: {
  //   ios: "best",
  //   android: "balancedPowerAccuracy"
  // },
  // // Android only
  // androidProvider: "auto",
  // interval: 5000, // Milliseconds
  // fastestInterval: 10000, // Milliseconds
  // maxWaitTime: 5000, // Milliseconds
  // // iOS Only
  // activityType: "other",
  // allowsBackgroundLocationUpdates: false,
  // headingFilter: 1, // Degrees
  // headingOrientation: "portrait",
  // pausesLocationUpdatesAutomatically: false,
  // showsBackgroundLocationIndicator: false,
})

export const updateLocationInMaps = (callBack) => {
  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'coarse'
    }
  }).then(granted => {
    if (granted) {
      this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
        if (locations.length > 0) {
          callBack(locations[0])
        }
      })
    }
  })
}


export const getDistance = (latitude1, longitude1, latitude2, longitude2) => {
  let distance = getDistanceGeoLib(
    { latitude: latitude1, longitude: longitude1 },
    { latitude: latitude2, longitude: longitude2 }
  );

  const result = {
    originalValue: distance,
    
    value: distance,
    unit: 'm'
  };

  return result;
};
