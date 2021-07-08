/**
 * @flow
 */

'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  TextInput,
  Platform,
  StyleSheet
} from 'react-native'
import { Icon } from 'react-native-elements'
import { Colors } from 'tell-me-common'
import PropTypes from 'prop-types'

class AddressInput extends PureComponent {
  render() {
    const {
      onPressClear,
      onChangeText,
      reverse,
      iconColor,
      value,
      ...inputProps
    } = this.props

    return (
      <View style={[styles.inputWrapper]}>
        <TextInput
          {...inputProps}
          onChangeText={text => onChangeText(text)}
          //autoCapitalize={'characters'}
          blurOnSubmit
          maxLength={50}
          value={value}
          ref={input => this.input = input}
          underlineColorAndroid={'transparent'}
          style={[styles.input]}
        />



        {onPressClear && value ? (
          <Icon
            onPress={() => {
              //this.input.focus()
              onPressClear()
            }}
            containerStyle={{
              marginRight: 12,
              backgroundColor: 'transparent'
            }}
            size={22}
            type='ionicon'
            color='#acacac'
            name='md-close-circle'
          />
        ) : null}

        <Icon
          onPress={this.props.onPressMaker}
          type={'material-community'}
          name='map-marker-radius'
          size={28}
          color={iconColor}
        />
      </View>
    )
  }
}

AddressInput.propTypes = {
  placeholderTextColor: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  onBlur: PropTypes.func,
  iconColor: PropTypes.string,
  name: PropTypes.string
}

const styles = StyleSheet.create({
  inputWrapper: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginBottom: 10,
    borderRadius: 4,
    alignSelf: 'stretch',
    borderColor: Colors.BLACK,
    borderWidth: 0.5,
    zIndex: 99999
  },
  input: {
    height: 35,
    paddingHorizontal: 8,
    flex: 1,
    fontSize: 12,
    marginLeft: 4,
    alignSelf: 'stretch'
  }
})

export { AddressInput }
