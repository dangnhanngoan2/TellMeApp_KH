import React, { useEffect } from 'react'
import FastImage from 'react-native-fast-image'


export const Image = ({ source, isUrl = false, ...props }) => {

  useEffect(() => {
    if(isUrl)
      FastImage.preload([source]);
  });

  return <FastImage
      source={source}
      resizeMode={FastImage.resizeMode.contain}
      {...props}
  />
}
