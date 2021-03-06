import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, TouchableOpacity, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Text } from '../../components/common/text'
import { Icon } from '../../components/common/icon'
import { ComponentLayout } from '../../components/common/component-layout'
import { Colors, I18n } from 'tell-me-common'
import { PaymentItem } from '../../components/payment/payment-item'
import { apiBankInfo } from '../../api/api-bank-info';
import { apiService } from '../../api/api-service'
import { SurPlus } from '../../components/home/items/surplus';
import { ScrollView } from 'react-native-gesture-handler'
import ModalManager from '../../components/modal-controller/modal-controller'
import { Withdrawal } from '../../components/payment/withdrawal'
const { height, width } = Dimensions.get('window')

class Payments extends Component {
  constructor() {
    super()
    this.state = {
      bankInfo: [],
      services: []
    },
      this.bankdata = [
        { id: 1, title: "chu tai khoan", value: "Nguyen van thien" }
      ]
  }

  async componentDidMount() {
    const servicesResult = await apiService.getAllServices()
    if (servicesResult.status === "success") {
      this.setState({ services: servicesResult.data })
    }
    const bankInfodata = await apiBankInfo.getBankInfo()
    console.log('bankInfodata: ', bankInfodata)
    if (bankInfodata.status === "success") {
      this.setState({ bankInfo: bankInfodata.data })
    }
  }

  openWithdrawal = ()=> {
    ModalManager.show(<Withdrawal />, 94, 'center', { borderRadius: 10, alignItems: 'center' })
  }

  render() {
    console.log('this is render')
    const { bankInfo, services } = this.state
    const { auth } = this.props
    const { amount } = auth ? auth.user.wallet : 0
    return (
      <ComponentLayout isNotification navigation={this.props.navigation} SurPlus>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.withdrawal}>
              <TouchableOpacity onPress={this.openWithdrawal} style={styles.button}>
                <Text style={styles.whiteText}>R??t ti???n</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitle}>
              <Text style={styles.content}>
                {I18n.t('payment.text1')} {' '}
                <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>{' '}{I18n.t('payment.text2')}
              </Text>
              <Text style={styles.content}>{I18n.t('payment.text3')}</Text>
              <Text style={styles.content}> 1 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>= 1000 VND.</Text>
              {/* <Text style={styles.content}> 1 USD= 23{' '}<Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>.</Text> */}
              <Text style={[styles.content, { paddingTop: 3, marginLeft: 5, marginBottom: 10, }]}>{I18n.t('payment.text6')} </Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={[styles.viewTable, { marginLeft: 18 }]}>
                  <Text style={styles.textNormal}>{I18n.t('payment.price_list')}</Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>
                    {I18n.t('payment.heart')}
                  </Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>{I18n.t('payment.money')}</Text>
                </View>
              </View>
              {services.map(service => {
                return <View style={{ flexDirection: 'row' }}>
                  <View style={[styles.viewTable, { marginLeft: 18 }]}>
                    <Text style={styles.textNormal}>{service.name}</Text>
                  </View>
                  <View style={styles.viewTable}>
                    <Text style={styles.textNormal}>{service.price} <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text></Text>
                  </View>
                  <View style={styles.viewTable}>
                    <Text style={styles.textNormal}>{service.cash_price}K</Text>
                  </View>
                </View>
              })}
              
              {/* <View style={{ flexDirection: 'row' }}>
                <View style={[styles.viewTable, { marginLeft: 18 }]}>
                  <Text style={styles.textNormal}>{I18n.t('payment.feast')}</Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>500 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text></Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>600K</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.viewTable, { marginLeft: 18 }]}>
                  <Text style={styles.textNormal}>{I18n.t('payment.sing')}</Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>500 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text></Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>600K</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={[styles.viewTable, { marginLeft: 18 }]}>
                  <Text style={styles.textNormal}>{I18n.t('payment.assistant')}</Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>1000 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text></Text>
                </View>
                <View style={styles.viewTable}>
                  <Text style={styles.textNormal}>1200K</Text>
                </View>
              </View> */}
            </View>
            <View style={styles.resonTitle}>
              <Text style={styles.resoncontent}>{I18n.t('payment.content')}</Text>
            </View>

     
            <PaymentItem bankInfo={bankInfo} />
           
            <View style={styles.headerBottom}>

              <Text style={styles.titleH1}>Quy ?????nh d??ng Tellme.</Text>
              <Text style={styles.titleH2}>1. Kh??ch h??ng c?? t???i thi???u 500 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>  l???n ?????u ti??n s??? d???ng. (N???p t??? ?????i l?? ho???c Tellme)</Text>
              <Text style={styles.titleH2}>2. N???u B???n book NV li??n ti???p 3 l???n trong 30 ph??t m?? kh??ng ch???n NV n??o. Th?? t??? l???n th??? 4 tr??? ??i s??? m???t 100k/1 booking. ??i???u n??y ????? ?????m b???o B???n nghi??m t??c v???i d???ch v???, tr??nh Spam.</Text>
              <Text style={styles.titleH2}>3. H?????ng d???n booking:</Text>
              <Text style={styles.titleA}>B???n ch???n 1 d???ch v??? v?? book</Text>
              <Text style={styles.titleA2}>{`->`} NV trong b??n k??nh 30km s??? nh???n ???????c th??ng b??o </Text>
              <Text style={styles.titleA2}>{`->`} NV s???n s??ng hi???n l??n ????? B???n ch???n</Text>
              <Text style={styles.titleA2}>{`->`} NV s??? nh???n tin ho???c g???i cho b???n ????? x??c nh???n v?? di chuy???n ?????n ??i???m h???n</Text>
              <Text style={styles.titleA2}>{`->`} Khi NV g???p B???n s??? ???n n??t "B???t ?????u cu???c h???n" (b???t ?????u t??nh gi??? h???n).</Text>

              <Text style={styles.titleA}>N???u k???t th??c cu???c h???n th?? ??i???n tho???i c???a B???n s??? hi???n l??n danh s??ch c??c s??? th??ch v?? kh??? n??ng c???a NV ????? b???n c?? th??? h???i nh??n vi??n tr?????c khi l???a ch???n book ti???p theo s??? th??ch m???c ?????nh l?? 2 ti???ng. K???t th??c cu???c h???n B???n s??? ????nh gi?? Nh??n vi??n gi??p ch??ng t??i. Nh??n vi??n xin ph??p ra v??? (nh???n l????ng t??? ?????ng tr??n ???ng d???ng)</Text>
              <Text style={styles.titleA}>N???u B???n thanh to??n b???ng ti???n m???t th?? sau cu???c h???n b???n s??? thanh to??n cho NV s??? ti???n ???? ???????c th??ng b??o tr??n App.</Text>
              <Text style={styles.titleA}>Sau n??y B???n c?? th??? v??o l???ch s??? cu???c h???n ????? h???n l???i t???t c??? c??c nh??n vi??n m?? b???n ???? t???ng g???p ????? h??? tr??? c??ng vi???c cho B???n.</Text>


              <Text style={styles.titleH2}>Khi book th??nh c??ng.</Text>
              <Text style={styles.titleA}>B???n h???y s??? m???t 30% cu???c h???n.</Text>
              <Text style={styles.titleA}>Nvien h???y s??? m???t 20% cu???c h???n.</Text>

              <Text style={styles.titleH2}>B???n d??ng App TellMe ?????:</Text>
              <Text style={styles.titleA}>* Gi???i t???a stress trong cu???c s???ng.  </Text>
              <Text style={styles.titleA}>* Ngo???i giao c??ng vi???c.</Text>
              <Text style={styles.titleA}>* Giao l??u b???n b??.</Text>
              <Text style={styles.titleA}>* Tuy???n nh??n vi??n. </Text>
              <Text style={styles.titleA}>* Tuy???n tr??? l??.</Text>
              <Text style={styles.titleA}>* T??m ?? trung nh??n, Ng?????i y??u.</Text>
              <Text style={styles.titleA}>* Mua b??n c??c s???n ph???m d???ch v??? cao c???p tr??n " S??n Tellme"</Text>
              <Text style={styles.titleH1}>Ch??c b???n nh???n ???????c th???t nhi???u gi?? tr??? khi tham gia "C???ng ?????ng v??n minh Tellme"</Text>
              <Text style={styles.textcontent}>
                {I18n.t('payment.best_regard')}
              </Text>
            </View>

          </View>
        </ScrollView>

      </ComponentLayout>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flex: 1,
    // marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  commonText: {
    fontWeight: '700'
  },
  viewTable: {
    borderColor: Colors.WHITE,
    borderWidth: 0.5,
    width: width * 0.27,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingHorizontal: 0.04 * width,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderBottomWidth: 0
  },
  headerBottom: {
    backgroundColor: Colors.WHITE,
    width: width - 30,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 7,
    // borderColor: 'red',
    // borderWidth: 1,rrr
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerTitle: {
    width: width - 30,
    backgroundColor: Colors.GREEN,
    borderRadius: 8,
    paddingVertical: 8
  },
  resonTitle: {
    width: width - 30,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
  },
  boldText: {
    color: Colors.WHITE,
    fontSize: 28,
    fontWeight: '600'
  },

  textNormal: {
    color: Colors.WHITE,
    fontSize: 13
  },
  textcontent: {
    fontSize: 13,
    paddingHorizontal: 0.01 * width,
    paddingTop: 10,
  },
  content: {
    color: Colors.WHITE,
    paddingTop: 10,
    fontSize: 13,
    paddingHorizontal: 0.04 * width
  },
  resoncontent: {
    color: Colors.GREEN,
    paddingTop: 10,
    fontSize: 13,
    paddingHorizontal: 0.04 * width
  },

  list: {
    marginTop: 10,
    paddingBottom: Platform.OS == 'ios' ? 0 : 40,
    width: width- 30,
    alignItems: 'center',
    shadowColor: Colors.BLACK,
    borderRadius: 7,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    elevation: 5,
    //backgroundColor: 'red'
  },

  titleH1: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  titleH2: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 3
  },
  titleA: {
    fontSize: 14,
    marginLeft: 8
  },
  titleA2: {
    fontSize: 14,
    marginLeft: 12
  },
  button: {
    backgroundColor: Colors.ORANGE,
    marginBottom: 10,
    paddingVertical: 5,
    borderRadius: 8,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  whiteText: {
    color: '#fff'
  },
  withdrawal: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 0.04 * width,
  }
})
mapStateToProps = ({ auth }) => {
  return {
    auth
  }
}

exports.Payments = connect(mapStateToProps)(Payments)
