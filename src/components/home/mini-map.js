import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import { apiGeolocation, apiGooglePlaces } from '../../api/api-geolocation'
import { SearchPlace } from './search-place'
import { Text } from '../common/text'
import { Metrics, Colors, I18n } from 'tell-me-common'
import { StaffLocation } from './staff-location';

const ASPECT_RATIO = Metrics.WINDOW_WIDTH / Metrics.WINDOW_HEIGHT
const LATITUDE_DELTA = 0.01
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = { top: 40, right: 50, bottom: 10, left: 50 }


export class MiniMap extends Component {
  constructor(props) {
    super(props)
    const { locationApp } = props;
    console.log('locationApp: ', locationApp)
    this.state = {
      currentRegion: {
        ...locationApp.location,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      isMapReady: false,
      currentPlace: locationApp.formatted_address,
      staffs: []
    }
  }

  componentDidMount() {
    this.setCurrentLocation()
  }

  async setCurrentLocation() {
    const { locationApp } = this.props;
    console.log('locationApp; ', locationApp)
    this.setState({
      currentRegion: {
        ...locationApp.location,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      currentPlace: locationApp.formatted_address
     }, ()=>{
      this.props.setItem({
        formatted_address: locationApp.formatted_address,
        location: {
          lat: this.state.currentRegion.latitude,
          lng: this.state.currentRegion.longitude
        }
      }, 'address');

      // this.map && this.map.fitToCoordinates([
      //   {
      //     ...locationApp.location,
      //     latitudeDelta: LATITUDE_DELTA,
      //     longitudeDelta: LONGITUDE_DELTA
      //   }
      // ]);
    })
   
    //this.map.animateToViewingAngle(60, 3000);
  }

  setAddress = (address) => {
    if (address.location) {
      this.props.setItem(address, 'address');
      this.setState({
        currentRegion: {
          latitude: address.location.lat,
          longitude: address.location.lng
        },
        currentPlace: address.formatted_address
      })
    }

  }

  onMapLayout = () => {
    this.setState({ isMapReady: true }, () => () => {
      this.map.animateToRegion(this.state.currentRegion, 500);
    })
  };

  fitTwoMarkers = (staffs) => {
    this.map.fitToCoordinates(
      [
        {
          latitude: parseFloat(this.state.currentRegion.latitude),
          longitude: parseFloat(this.state.currentRegion.longitude)
        },
        ...staffs.map(value => {
          return {
            latitude: parseFloat(value.latitude),
            longitude: parseFloat(value.longitude)
          }
        })
      ],
      {
        edgePadding: DEFAULT_PADDING,
        //animated: true
      }
    )
  }

  render() {
    const { currentRegion, isMapReady, currentPlace } = this.state
    console.log('currentRegion:11 ', currentRegion)

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('home.address')}</Text>
        <SearchPlace
          currentRegion={currentRegion}
          currentPlace={currentPlace}
          fitToCenter={() => {
            this.setCurrentLocation();
          }} setAddress={this.setAddress} />
        <MapView
          ref={ref => (this.map = ref)}
          provider={PROVIDER_GOOGLE}
          onLayout={() => this.fitTwoMarkers([])}
          geodesic
          maxZoomLevel={18}
          zoom={13}
          zoomEnabled={true}
          style={styles.map}
          onLayout={this.onMapLayout}

          initialRegion={{
            ...currentRegion,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          region={{
            ...currentRegion,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          {isMapReady && (
            <Fragment>
              <Marker
              description={currentPlace}
                style={{ zIndex: 9999 }}
                pinColor={Colors.BLUE}
                opacity={1}
                coordinate={{
                  latitude: currentRegion.latitude,
                  longitude: currentRegion.longitude
                }}
              >
                <Callout>
                    <Text style={{width: 100}}>{currentPlace}</Text>
                  </Callout>
              </Marker>
              <StaffLocation location={currentRegion} fitTwoMarkers={this.fitTwoMarkers} />
            </Fragment>
          )}
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20
  },
  title: {
    fontWeight: '600',
    marginBottom: 10
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10
  }
})
