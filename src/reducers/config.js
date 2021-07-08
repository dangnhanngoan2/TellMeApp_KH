/**
 * @flow
 */

'use strict';

import Types from '../actions/types';

const LATITUDE = 21.017835
const LONGITUDE = 105.773749

const INITIAL_STATE = {
  language: 'vi',

  currentLocation: {
    formatted_address: ' ',
    location: {
      latitude: LATITUDE,
      longitude: LONGITUDE
    }
  }
};

export const config = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SET_LANGUAGE:
      return {
        ...state,
        language: action.language
      };

    case Types.SET_LOCATION:
      return {
        ...state,
        currentLocation: action.location
      };
    default:
      return state;
  }
};
