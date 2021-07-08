import React,{Component} from 'react'
import {View,TextInput,StyleSheet,Dimensions,TouchableOpacity,Text} from 'react-native'
import { RadiusInput } from '../common/input-radius'
import { RadiusButton } from '../common/radius-button'
import { Colors } from 'tell-me-common'
const { height, width } = Dimensions.get('window')
export class Modal extends Component {
    state={
        phone:'',
    }
    render(){
        const {onPress} =this.props
        return(
            <View style={styles.container}>
            <Text style={styles.modal}>Modal</Text>
            <RadiusInput
                icon={'phone'}
                value={this.state.phone}
                onChangeText={(text) => this.setState({ phone: text })}
                style={styles.input}
                placeholder='Nhập số điện thoại'/>
            <RadiusButton onPress={onPress} style={styles.buttonStyle} title='Đăng nhập'/>
            <Text style={styles.textlogout}>Thoát tài khoản</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        width:100,
        height:300
    },
    textContent: {
        fontSize: 14,
        color: Colors.BLACK,
        marginTop: 30 * height / 667
      },
      input: {
        marginTop: 35 * height / 667,
        marginLeft: 15,
      },
      buttonStyle: {
        marginTop: 25 * height / 667,
        marginLeft: 15,
      },
      textlogout:{
        marginLeft:20,
        marginTop:10
    },
    modal:{
        
    }
})