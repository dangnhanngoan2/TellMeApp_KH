import React, { Component } from 'react';
import { CameraKitCameraScreen } from 'react-native-camera-kit'


export default class CameraScreen extends Component {


  onBottomButtonPressed(event) {
    const captureImages = event.captureImages;
    let cancelProps = null;
    let doneProps = null;
    const { navigation } = this.props;
    if (navigation) {
      const { state: { params } } = navigation;
      cancelProps = params.cancel;
      doneProps = params.cameraDone;
    }
    if (event.type === 'left') {
      if (cancelProps) {
        navigation.goBack();
        return cancelProps();
      }
      this.props.cancel()
    } else if (event.type === 'right') {
      if (doneProps) {
        navigation.goBack();
        return doneProps(captureImages);
      }
      this.props.cameraDone(captureImages)
    }
  }

  render() {
    return (
      <CameraKitCameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        flashImages={{
          on: require('./../../assets/images/flashOn.png'),
          off: require('./../../assets/images/flashOff.png'),
          auto: require('./../../assets/images/flashAuto.png')
        }}
        cameraFlipImage={require('./../../assets/images/cameraFlipIcon.png')}
        captureButtonImage={require('./../../assets/images/cameraButton.png')}
      />
    );
  }
}