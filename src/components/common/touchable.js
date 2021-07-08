import React from 'react'
import { TouchableOpacity as RNTouchableOpacity } from 'react-native'
import { throttle } from 'lodash'


export const TouchableOpacity = ({ onPress, children, ...props }) => {
    return <RNTouchableOpacity
        onPress={onPress ? throttle(onPress, 2000, { leading: true, trailing: false }) : ()=>{}}
        {...props}>
        {children}
    </RNTouchableOpacity>
}
