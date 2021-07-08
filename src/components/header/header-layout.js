import React from 'react'
import { connect } from 'react-redux'
import { Header as HeaderElement } from 'react-native-elements'
import { StyleSheet, Dimensions, Text, Alert } from 'react-native'
import { HeaderButton } from './header-button'
import { SurPlus } from '../home/items/surplus'
import { apiProfile } from '../../api/api-profile'
import { saveAmount } from '../../actions/actions-user'
import { Colors, I18n } from 'tell-me-common'
const { width } = Dimensions.get('window')
const Header = ({
  surPlus,
  navigation,
  backgroundColor,
  backFunction,
  isNotification,
  rightHasNoti,
  text,
  noRight,
  noLeft,
  centerTitle,
  user,
  notification,
  noEventAmount,
  auth,
  dispatch
}) => {

  let amount = 0;
  if (user) {
    amount = user.amount;
  }

  let partner_code = '';
  if (auth && auth.user){
    partner_code = auth.user.partner_code
  }
  const newAmout = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const updateAmount = async () => {
    if (auth) {
      const { user } = auth;
      const profileResult = await apiProfile.getProfile(user.id);
      console.log('profileResult: ', profileResult)
      if (profileResult.status === 'success') {
        const { data } = profileResult;
        const amount = data.wallet.amount;
        dispatch(saveAmount(amount))
      }
    }
  }
  return <HeaderElement
    statusBarProps={{ translucent: true, backgroundColor: Colors.GREEN }}
    barStyle={'dark-content'}
    containerStyle={[styles.header, { backgroundColor: backgroundColor || Colors.WHITE }]}
    leftComponent={!noLeft && (
      isNotification ? <HeaderButton
        name={'notification'}
        size={25}
        text={partner_code}
        badgeCount={notification > 0 ? notification : ''}
        color={Colors.ORANGE}
        onPress={() => {
          navigation && navigation.push('Notifications')
        }}
      /> : <HeaderButton
          name={'left'}
          size={26}
          color={Colors.GREEN}
          text={text || 'Back'}
          onPress={() => backFunction ? backFunction() : navigation.goBack()}
        />
    )}
    centerComponent={centerTitle && <Text style={styles.title}>{centerTitle}</Text>}
    centerContainerStyle={{ flex: 0 }}
    rightContainerStyle={{ flex: 1 }}
    rightComponent={!noRight && (
      rightHasNoti ? <HeaderButton
        name={'notification'}
        size={25}
        badgeCount={notification > 0 ? notification : ''}
        color={Colors.ORANGE}
        onPress={() => {
          navigation && navigation.push('Notifications')
        }}
      /> : <SurPlus updateAmount={updateAmount} noEventAmount={noEventAmount} navigation={navigation} content={`${I18n.t('header.surplus')}: ${newAmout}`} />
    )}
  />
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 0.02 * width,
    borderBottomWidth: 0,
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.BLACK,
  }
})

const mapStateToProps = ({ user, notification, auth }) => {
  return {
    user,
    notification,
    auth
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
});

exports.Header = connect(mapStateToProps, mapDispatchToProps)(Header)
