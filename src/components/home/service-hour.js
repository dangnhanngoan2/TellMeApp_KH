import React, { Component, Fragment } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "tell-me-common";
import { serviceHomeOptions, hours } from "../../common/static-data";
import { ChooseHours } from "./choose-hours";
import { ChooseServices } from "./choose-services";
const { width } = Dimensions.get("window");

export class ServiceHour extends Component {
  constructor(props) {
    super(props);
    const { service, hour } = props.order;
    console.log("props.order: ", props.order);
    this.state = {
      hour: hour,
      service: service,
      services: serviceHomeOptions,
    };
  }

  // đối với service với id = 1 là: Cafe sẽ có min hour = 1 giờ
  // với service có id khác 1 sẽ có min hour là 2 giờ

  onPress = (item, feild) => {
    const { hour } = this.state;
    if (
      feild === "service" &&
      item &&
      item.id !== 1 &&
      (hour && hour.id === 1)
    ) {
      this.props.setItem(item, feild);
      this.props.setItem(hours[1], "hour");
      return this.setState({ [feild]: item, hour: hours[1] });
    }

    this.props.setItem(item, feild);
    return this.setState({ [feild]: item });
  };

  render() {
    const { hour, service } = this.state;
    return (
      <Fragment>
        <ChooseServices service={service} setItem={this.onPress} />
        <ChooseHours service={service} hour={hour} setItem={this.onPress} />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 20,
  },
  title: {
    fontWeight: "600",
    marginBottom: 10,
  },
  hour: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    height: 30,
    borderColor: Colors.BLACK,
    borderWidth: 0.5,
    borderRadius: 15,
    width: 0.2 * width,
  },
  contentHour: {
    fontSize: 12,
    color: Colors.BLACK,
  },
  containerHours: {
    marginVertical: 5,
    width: 0.9 * width,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
