import React from 'react'
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

export const InputCustom = ({ placeholder, icon, onChangeText, ...props }) => {
  return <Input
    placeholder={placeholder}
    icon={icon}
    onChangeText={onChangeText}
    {...props}
    containerStyle={{ height: 60 }}
    leftIconContainerStyle={{ marginRight: 10 }}
    leftIcon={
      <Icon
        name={icon}
        size={25}
        color='#fff'
      />
    }
  />
}
