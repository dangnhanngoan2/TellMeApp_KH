import React, { PureComponent } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { serviceHomeOptions } from '../../common/static-data'
import { ServiceItem } from './items/service-item'
import { apiService } from '../../api/api-service'
import { Text } from '../common/text'
import { I18n } from 'tell-me-common'
export class ChooseServices extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      services: serviceHomeOptions
    }
  }

  async componentDidMount() {
    const servicesResult = await apiService.getServices()
    console.log('servicesResult1: ', servicesResult)
    if (servicesResult.status === "success") {
      const services = servicesResult.data.map(value => {
        const findIndex = serviceHomeOptions.findIndex(v => v.id === value.id);
        if (findIndex !== -1) {
          return {
            ...serviceHomeOptions[findIndex],
            ...value
          }
        }
        return value;
      });
      this.setState({ services })
      
    }
  }

  onPress = (item, isCheck) => {
    const { setItem } = this.props
    if (isCheck) {
      return setItem(item, 'service')
    }
    return setItem(null, 'service')
  }

  render() {
    const { services } = this.state
    const { service } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('home.choose_services')}</Text>
        <ScrollView contentContainerStyle={{ marginTop: 5 }} horizontal>
          {services.map(value => {
            const isCheck = service !== null ? service.id === value.id : false
            return <ServiceItem
              isCheck={isCheck}
              onPress={(item, isCheck) => this.onPress(item, isCheck)}
              key={value.id}
              item={value} />
          })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 0
  },
  title: {
    fontWeight: '600',
    marginBottom: 10
  }
})
