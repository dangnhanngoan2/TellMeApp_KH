import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, FlatList, Platform } from 'react-native'
import { ComponentLayout } from '../../components/common/component-layout'
import { connect } from 'react-redux'
import { Colors,I18n } from 'tell-me-common'
import { TransactionItem } from '../../components/account/transaction-item'
import moment from 'moment'
const { height, width } = Dimensions.get('window')

export class TransactionDetail extends Component {

  render() {
    
    const { navigation } = this.props;
    const { transaction } = navigation.state.params;
    console.log('transaction: ', transaction)

    const data = [
      {
        content: transaction.code_transaction,
        title: I18n.t('transaction.number'),
        isHeart: true,
        amount: transaction.amount
      },
      {
        title: I18n.t('transaction.date'),
        content: moment(transaction.created_at).format('MM/DD/YYYY')
      },
      {
        content: transaction.amount,
        title: I18n.t('transaction.monney'),
        isHeart: true
      }
    ]

    return (
      <ComponentLayout headerText={I18n.t('transaction.detail')} rightHasNoti navigation={this.props.navigation}>
        <View style={styles.container}>
          <FlatList
            keyExtractor={(value, index) => index.toString()}
            data={data}
            renderItem={({ item }) => <TransactionItem item={item} />}
          />
        </View>
      </ComponentLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flex: 1
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },

  scrollview: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: 0.05 * width,
    paddingBottom: Platform.OS == 'ios' ? 80 : 100
  },
  header: {
    paddingHorizontal: 0.04 * width,
    backgroundColor: Colors.WHITE,
    justifyContent: 'space-between',
    borderBottomWidth: 0
  },
  changeTab: {
    flexDirection: 'row',
    height: (60 * height) / 667,
    width: width,
    paddingLeft: (30 * width) / 375,
    backgroundColor: '#fff',
    paddingTop: 10
    // alignItems: 'center'
  },
  bottomTab: { width: 0.35 * width, height: 30 }
})
