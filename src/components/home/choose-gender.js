import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native'
import { genders } from '../../common/static-data'
import { Text } from '../common/text'
import { GenderItem } from './items/gender-item'
import { Colors,I18n } from 'tell-me-common'
const { height, width } = Dimensions.get('window')

export class ChooseGender extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gender: genders[0]
    }
  }

    onPress = (item) => {
      this.props.setItem(item, 'gender')
      this.setState({ gender: item })
    }

    render () {
      const { gender } = this.state
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{I18n.t('home.choose_gender')}</Text>
          <View style={styles.containerHours}>
            <GenderItem isCheck={gender.id === genders[0].id} onPress={() => this.onPress(genders[0])} item={genders[0]} />
            <GenderItem isCheck={gender.id === genders[1].id} onPress={() => this.onPress(genders[1])} item={genders[1]} />
          </View>
        </View>

      )
    }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20
  },
  title: {
    fontWeight: '600',
    marginBottom: 10
  },
  containerHours: {
    marginVertical: 5,
    width: 0.87 * width,
    justifyContent: 'space-between',
    flexDirection: 'row'
  }
})
