import React, { Component } from 'react'
import { View, Dimensions, TextInput, StyleSheet } from 'react-native'
import { RadiusButton } from '../common/radius-button'
import ModalController from '../../components/modal-controller/modal-controller'
import { Text } from '../common/text'
import { Colors, I18n } from 'tell-me-common'

const { width, height } = Dimensions.get('window')

export class CancelOther extends Component {
  constructor(props){
    super(props);
    this.state={
      reason: ''
    }
  }

  createFeedback = ()=>{
    const { reason } = this.state;
    ModalController.dismiss();
    if(reason)
      this.props.setReason({ name: reason, id: 7})
  }

  render() {

    const { reason } = this.state;

    return (
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t('card_info.title_other')}</Text>
          <TextInput
            style={styles.input}
            value={reason}
            multiline
            onChangeText={text => this.setState({ reason: text })}
          />
          <RadiusButton onPress={this.createFeedback} style={styles.buttonStyle} title='Confirm' />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width *0.85,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    borderRadius: 5,
    // flex: 1
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10
  },
  buttonStyle: {
    marginTop: 25 * height / 667,
    width: 0.8 * width,
  },
  input: {
    height: 150,
    width: width *0.8,
    marginTop: 15,
    borderWidth: 0.5,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '90%',
    borderRadius: 6,
    borderColor: Colors.GRAY_MEDIUM
  }
})
