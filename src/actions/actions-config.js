import Types from './types';

export function setLanguage(language) {
  return {
    type: Types.SET_LANGUAGE,
    language
  };
}

export function setLocation(location) {
  return {
    type: Types.SET_LOCATION,
    location
  };
}

