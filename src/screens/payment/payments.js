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
                <Text style={styles.whiteText}>Rút tiền</Text>
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

              <Text style={styles.titleH1}>Quy định dùng Tellme.</Text>
              <Text style={styles.titleH2}>1. Khách hàng có tối thiểu 500 <Text style={[styles.commonText, { color: Colors.RED }]}>Tim</Text>  lần đầu tiên sử dụng. (Nạp từ đại lý hoặc Tellme)</Text>
              <Text style={styles.titleH2}>2. Nếu Bạn book NV liên tiếp 3 lần trong 30 phút mà không chọn NV nào. Thì từ lần thứ 4 trở đi sẽ mất 100k/1 booking. Điều này để đảm bảo Bạn nghiêm túc với dịch vụ, tránh Spam.</Text>
              <Text style={styles.titleH2}>3. Hướng dẫn booking:</Text>
              <Text style={styles.titleA}>Bạn chọn 1 dịch vụ và book</Text>
              <Text style={styles.titleA2}>{`->`} NV trong bán kính 30km sẽ nhận được thông báo </Text>
              <Text style={styles.titleA2}>{`->`} NV sẵn sàng hiện lên để Bạn chọn</Text>
              <Text style={styles.titleA2}>{`->`} NV sẽ nhắn tin hoặc gọi cho bạn để xác nhận và di chuyển đến điểm hẹn</Text>
              <Text style={styles.titleA2}>{`->`} Khi NV gặp Bạn sẽ ấn nút "Bắt đầu cuộc hẹn" (bắt đầu tính giờ hẹn).</Text>

              <Text style={styles.titleA}>Nếu kết thúc cuộc hẹn thì điện thoại của Bạn sẽ hiện lên danh sách các sở thích và khả năng của NV để bạn có thể hỏi nhân viên trước khi lựa chọn book tiếp theo sở thích mặc định là 2 tiếng. Kết thúc cuộc hẹn Bạn sẽ đánh giá Nhân viên giúp chúng tôi. Nhân viên xin phép ra về (nhận lương tự động trên ứng dụng)</Text>
              <Text style={styles.titleA}>Nếu Bạn thanh toán bằng tiền mặt thì sau cuộc hẹn bạn sẽ thanh toán cho NV số tiền đã được thông báo trên App.</Text>
              <Text style={styles.titleA}>Sau này Bạn có thể vào lịch sử cuộc hẹn để hẹn lại tất cả các nhân viên mà bạn đã từng gặp để hỗ trợ công việc cho Bạn.</Text>


              <Text style={styles.titleH2}>Khi book thành công.</Text>
              <Text style={styles.titleA}>Bạn hủy sẽ mất 30% cuộc hẹn.</Text>
              <Text style={styles.titleA}>Nvien hủy sẽ mất 20% cuộc hẹn.</Text>

              <Text style={styles.titleH2}>Bạn dùng App TellMe để:</Text>
              <Text style={styles.titleA}>* Giải tỏa stress trong cuộc sống.  </Text>
              <Text style={styles.titleA}>* Ngoại giao công việc.</Text>
              <Text style={styles.titleA}>* Giao lưu bạn bè.</Text>
              <Text style={styles.titleA}>* Tuyển nhân viên. </Text>
              <Text style={styles.titleA}>* Tuyển trợ lý.</Text>
              <Text style={styles.titleA}>* Tìm ý trung nhân, Người yêu.</Text>
              <Text style={styles.titleA}>* Mua bán các sản phẩm dịch vụ cao cấp trên " Sàn Tellme"</Text>
              <Text style={styles.titleH1}>Chúc bạn nhận được thật nhiều giá trị khi tham gia "Cộng đồng văn minh Tellme"</Text>
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
