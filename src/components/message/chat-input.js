import React, { Component } from 'react'
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
  LayoutAnimation,
  StyleSheet,
  Alert
} from 'react-native'
import { Colors, I18n } from 'tell-me-common'
import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import moment from 'moment'

export class ChatInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Only for 0.55.2:
      text: '',
    }
  }

  onSend = () => {
    const { onSend, messageIdGenerator, user } = this.props
    const { text } = this.state
    if (!text && !text.trim()) return
    onSend({
      user,
      _id: messageIdGenerator(),
      text,
      createdAt: moment().toDate()
    })
    this.input.setNativeProps({ text: '' })
  };


  onTakePicture = () => {
    let options = {
      // Open Image Library:
      maxWidth: 400,
      title: 'Select Image',
      takePhotoButtonTitle: 'Take a Photo',
      chooseFromLibraryButtonTitle: 'Pick Photo',
      cancelButtonTitle: 'Cancel',

    }
    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert(I18n.t('common.alert_title'), response.error)
        console.log('ImagePicker Error: ', response.error);
      }
      if (response.uri) {
        console.log('response: ', response)
        const file = {
          uri: response.uri,
          type: response.type || 'image/jpeg',
          name: 'image'

        };

        const { onSend, messageIdGenerator, user } = this.props
        onSend({
          user,
          _id: messageIdGenerator(),
          image: file,
          createdAt: moment().toDate()
        })

      }
    })
  };


  render() {
    const { text } = this.state

    return (
      <View style={[styles.container]}>
        <TouchableOpacity style={styles.camera} onPress={this.onTakePicture}>
          <Icon size={33} name='camera' type='material-community' />
        </TouchableOpacity>
        <TextInput
          ref={ref => (this.input = ref)}
          multiline
          onChangeText={text => this.setState({ text })}
          value={text}
          maxLength={250}
          numberOfLines={4}
          style={[styles.input]}
          enablesReturnKeyAutomatically
          underlineColorAndroid='transparent'
        />
        <TouchableOpacity style={styles.submit} onPress={this.onSend}>
          <Icon size={33} color={Colors.GREEN} name='arrow-up-circle' type='material-community' />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '90%',
    // borderRadius: 20,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.GRAY_LIGHT,
    paddingVertical: Platform.select({
      ios: 5,
      android: 0
    })
  },
  submit: {
    //width: '20%',
    marginLeft: 12,
    paddingHorizontal: 8
  },
  submitText: {
    color: Colors.VIOLET,
    fontWeight: 'bold'
  },
  input: {
    //width: '80%',
    flex: 1,
    paddingLeft: 20,
    height: Platform.OS === 'android' ? 42 : 28
  },
  camera: {
    // position: 'absolute',
    paddingLeft: 8
  }
})
