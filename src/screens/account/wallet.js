import React, { Component, Fragment } from 'react'
import { StyleSheet, View, Dimensions, FlatList, Platform } from 'react-native'
import { ComponentLayout } from '../../components/common/component-layout'
import { connect } from 'react-redux'
import { Colors, I18n } from 'tell-me-common'
import { paymentMethod } from '../../common/static-data'
import { setLoading } from '../../modules/progress-hud'
import { WalletItem } from '../../components/account/wallet-item'
import { apiWallet } from '../../api/api-wallet'
import moment from 'moment'
const { height, width } = Dimensions.get('window')

export class Wallet extends Component {

  state = {
    transaction_books: []
  }

  // data = [
  //   {
  //     content: 'THANH TOÁN BOOKING DK901',
  //     time: moment().format('MM/DD/YYYY'),
  //     isHeart: true,
  //     amount: '+2000'
  //   },
  //   {
  //     content: 'THANH TOÁN BOOKING DK901',
  //     time: moment().format('MM/DD/YYYY'),
  //     isHeart: true,
  //     amount: '-200'
  //   },
  //   {
  //     content: 'THANH TOÁN BOOKING DK901',
  //     time: moment().format('MM/DD/YYYY'),
  //     isHeart: false,
  //     amount: '-800'
  //   },
  //   {
  //     content: 'THANH TOÁN BOOKING DK901',
  //     time: moment().format('MM/DD/YYYY'),
  //     isHeart: true,
  //     amount: '+200'
  //   },
  //   {
  //     content: 'THANH TOÁN BOOKING DK901',
  //     time: moment().format('MM/DD/YYYY'),
  //     isHeart: false,
  //     amount: '-200'
  //   },
  // ]

  async componentDidMount() {
    setLoading(true);
    try {
      const walletResult = await apiWallet.getWalletDetail();
      console.log('walletResult: ', walletResult);
      setLoading(false);
      if (walletResult.status == "success") {
        const { transaction_books } = walletResult.data;
        const transactionConvert = transaction_books.map(trans => {
          return {
            content: trans.content,
            time: moment(trans.created_at).format('MM/DD/YYYY'),
            isHeart: trans.method === paymentMethod[0],
            //receive là 1 thì là nhận tiền, 0 là trừ tiền
            receive: trans.receive,
            amount: trans.receive == 1 ? `+${Math.abs(trans.amount)}` : `-${Math.abs(trans.amount)}`
          }
        })
        this.setState({ transaction_books: transactionConvert });
      }
    } catch (error) {
      setLoading(false);
    }
  }

  render() {

    const { transaction_books } = this.state;

    return (
      <ComponentLayout headerText={I18n.t('accounts.wallet.title')} rightHasNoti navigation={this.props.navigation}>
        <View style={styles.container}>
          <FlatList
            keyExtractor={(value, index) => index.toString()}
            data={transaction_books}
            renderItem={({ item }) => <WalletItem item={item} />}
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
