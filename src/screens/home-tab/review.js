import React, { Component } from 'react'
import { StyleSheet, Dimensions, ScrollView, TextInput, Alert, Keyboard, DeviceEventEmitter } from 'react-native'
import { AirbnbRating } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { RadiusButton } from '../../components/common/radius-button'
import { SurPlus } from '../../components/home/items/surplus'
import { apiFeedback } from '../../api/api-feedback'
import { Text } from '../../components/common/text'
const { height, width } = Dimensions.get('window')

export class Review extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      score: 3
    }
  }

  createRate = async () => {
    const { content, score } = this.state;
    const { book } = this.props.navigation.state.params;
    const resultRate = await apiFeedback.createRate({
      book_id: book,
      content,
      score,
      type: 1
    });
    if (resultRate.status === 'success') {
      this.props.navigation.navigate('OrderByInterests', { book_id: book })
      Alert.alert(I18n.t('review.alert.title'),
        I18n.t('review.alert.content')
      )
      DeviceEventEmitter.emit('UPDATE_BACK_TO_HOME')
      
      Keyboard.dismiss()
    } else {
      Alert.alert(I18n.t('common.alert_title'), I18n.t('common.has_error'))
    }
  }

  componentWillUnmount() {
    Keyboard.dismiss();
  }

  onFinishRating = (score) => {
    this.setState({ score })
  }

  render() {
    const { score, content } = this.state;
    return (
      <ComponentLayout
        backFunction={() => {
          DeviceEventEmitter.emit('UPDATE_BACK_TO_HOME')
          this.props.navigation.navigate({
            routeName: 'News',
            action: NavigationActions.navigate({ routeName: 'Home' }),
          })
        }}
        navigation={this.props.navigation}>
        <ScrollView horizontal={false} contentContainerStyle={styles.container}>
          <Text style={styles.greenText}>{I18n.t('review.title')}</Text>
          <Text style={styles.feedbackText}>{I18n.t('review.say_goodbye')}</Text>
          <AirbnbRating
            style={{ marginVertical: 20 }}
            size={32}
            showRating={false}
            reviews={[]}
            onFinishRating={this.onFinishRating}
            startingValue={score}
          />
          <Text style={styles.feedbackText}>{I18n.t('review.send_feedback')}</Text>
          <TextInput
            style={styles.input}
            value={content}
            multiline
            onSubmitEditing={() => { Keyboard.dismiss() }}
            blurOnSubmit={true}
            onChangeText={text => this.setState({ content: text })}
          />
          <RadiusButton onPress={this.createRate} title={I18n.t('review.button')} style={{ width: 0.5 * width, height: 35, marginTop: 15 }} />
        </ScrollView>
      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center'
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  greenText: {
    color: Colors.GREEN,
    marginBottom: 10,
    width: '100%',
    textAlign: 'center'
  },

  feedbackText: {
    width: 0.9 * width,
    marginVertical: 10
  },
  input: {
    height: 100,
    marginTop: 15,
    width: 0.9 * width,
    borderWidth: 0.5,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '90%',
    borderRadius: 6,
    borderColor: Colors.GRAY_MEDIUM
  }
})
