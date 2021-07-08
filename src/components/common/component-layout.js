import React, { Component, Fragment } from 'react'
import { Header } from '../header/header-layout'

export class ComponentLayout extends Component {

  render() {
    const { auth, navigation, isNotification, rightHasNoti, headerText, noRight, backFunction, noLeft, centerTitle, noEventAmount, numberTim} = this.props
    return (
      <Fragment>
        <Header
          numberTim={numberTim}
          noEventAmount={noEventAmount}
          isNotification={isNotification}
          backFunction={backFunction}
          noRight={noRight}
          noLeft={noLeft}
          centerTitle={centerTitle}
          rightHasNoti={rightHasNoti}
          navigation={navigation}
          text={headerText}
          centerComponent
        />
        {this.props.children}
      </Fragment>
    )
  }
}
