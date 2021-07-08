import React from 'react';
import DialogManager, { SlideAnimation, DialogContent } from 'react-native-dialog-component/src/index.js';
import { Dimensions, Platform, Text, StatusBar } from 'react-native';
import { Colors } from 'tell-me-common'

const ModalManager = {
  show: (
    children,
    widthRatio: number = 94,
    position: string,
    extraStyle: Object = { alignItems: 'center', borderRadius: 10 }
  ) => {
    const standardStyle = {
      borderRadius: 10,
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0
    };
    let bottomStyle;
    switch (position) {
      case 'bottom':
        bottomStyle = { position: 'absolute', bottom: 0 };
        break;
      case 'middle':
        bottomStyle = { marginBottom: Platform.OS === 'android' ? 60 : 80 };
        break;
      default:
    }
    DialogManager.show(
      {
        title: null,
        width: Dimensions.get('window').width * (widthRatio / 100),
        dialogStyle: { ...standardStyle, ...bottomStyle, ...extraStyle },
        titleAlign: 'center',
        animationDuration: 200,
        dialogAnimation: new SlideAnimation({ slideFrom: 'bottom' }),
        children
      },
      () => { }
    );
  },

  showToast: (
    children,
    timer
  ) => {

    const backgroundColor = Colors.WHITE;
    console.log('StatusBar.currentHeight: ', StatusBar.currentHeight)

    DialogManager.show(
      {
        title: null,
        dismissOnHardwareBackPress: false,
        dismissOnTouchOutside: true,
        // haveOverlay: false,
        dialogStyle: {
          top: 0,
          position: 'absolute',
          padding: 0,
          minHeight: 0,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        },
        titleAlign: 'center',
        animationDuration: 200,
        dialogAnimation: new SlideAnimation({ slideFrom: 'top' }),
        children: <DialogContent contentStyle={{
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight + 10 : 40,
        }} >
          <Text style={{ color: Colors.GREEN, textAlign: 'center'}}>{children}</Text>
        </DialogContent>
      },
      () => {
        setTimeout(() => {
          if(DialogManager)
            DialogManager.dismiss();
        }, 10000)
      }
    );
  },

  dismiss: () => {
    DialogManager.dismiss();
  }
};

export default ModalManager;