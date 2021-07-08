import React, { Component } from 'react'
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard
} from 'react-native'
import { Icon } from 'react-native-elements'
import { Colors, I18n } from 'tell-me-common'
import { Text } from '../common/text'
import { AddressInput } from './items/address-input'
import { apiGooglePlaces } from '../../api/api-geolocation'

export class SearchPlace extends Component {
  constructor(props) {
    super(props);
    const { currentPlace } = props;
    this.state = {
      keyword: currentPlace,
      suggestions: [],
      recentSearches: null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentPlace !== this.props.currentPlace) {
      this.setState({ keyword: nextProps.currentPlace })
    }
  }
  handleChangeText = text => {
    const { currentRegion } = this.props;
    const { latitude, longitude } = currentRegion;
    this.setState({ keyword: text })
    apiGooglePlaces
      .autoCompletePlaces({ input: text, types: 'geocode', location: `${latitude},${longitude}`, radius: 50000 })
      .then(resp => {
        console.log('resp-------------: ',JSON.stringify(resp))
        if (resp.status !== 'OK') {
          return setTimeout(async () => {
            const queryResult = await apiGooglePlaces.queryCompletePlaces({ input: text, types: 'geocode' });
            console.log('queryResult: ', queryResult)
            this.setState({ suggestions: queryResult.predictions })
          }, 100)
        }
        if (!text.trim()) {
          this.setState({ suggestions: [] })
        } else {
          this.setState({ suggestions: resp.predictions })
        }
      }).catch(err => console.log(err))
  };

  handleSelect = ({ place_id }) => {
    console.log("T111111------", place_id)
    apiGooglePlaces.getPlaceDetail(place_id).then(resp => {
      console.log(resp.result)

      let address = {
        formatted_address: resp.result.formatted_address,
        location: resp.result.geometry.location
      }
      this.props.setAddress(address);
      Keyboard.dismiss()
      this.setState({ suggestions: [], keyword: address.formatted_address })
    }).catch((e) => console.log(e))
  };

  onPressCurrentLocation() {

  }

  selectRecentItem = ({ formatted_address, location }) => {
    console.log("T1111112222222222------", formatted_address)
    this.props.setAddress({ formatted_address, location });
    Keyboard.dismiss()
    this.setState({ suggestions: [], keyword: address.formatted_address })
  };
  /* eslint-enable camelcase */

  render() {
    const { keyword, suggestions } = this.state
    return (
      <ScrollView
        extraHeight={40}
        keyboardShouldPersistTaps='always'
      >
        <AddressInput
          placeholder={I18n.t('home.enter_address')}
          iconColor={Colors.GREEN}
          onPressMaker={() => {
            this.props.fitToCenter();
            this.setState({ 
              keyword: this.props.currentPlace,
              suggestions: [] })
          }}
          value={keyword}
          keyboardType={'email-address'}
          enablesReturnKeyAutomatically={true}
          onPressClear={() => this.setState({ keyword: '', suggestions: [] })}
          onChangeText={text => this.handleChangeText(text)}
          listContainerStyle={{ top: 48, zIndex: 777 }}
        />

        {suggestions.map(suggestion => (
          <TouchableOpacity
            key={suggestion.id}
            activeOpacity={0.7}
            style={styles.itemSuggestion}
            onPress={() =>
              suggestion.place_id
                ? this.handleSelect(suggestion)
                : this.selectRecentItem(suggestion)
            }
          >
            <Icon
              type={'simple-line-icon'}
              name='location-pin'
              size={20}
            //color={'#bdbcbc'}
            />
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={styles.textSuggestion}
            >
              {suggestion.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  myPositionWrapper: {
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 16,
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 0 : 12,
    zIndex: 0
  },
  myPosition: {
    marginLeft: 12,
    backgroundColor: 'transparent',
    color: '#a8a7a7',
    fontSize: 18,
    justifyContent: 'center'
  },
  itemSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1
  },
  textSuggestion: {
    //color: '#a8a7a7',
    fontSize: 14,
    maxWidth: Dimensions.get('window').width * 0.8
  }
})
