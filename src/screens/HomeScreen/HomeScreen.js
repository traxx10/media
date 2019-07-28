import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
class HomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          containerStyle={{ backgroundColor: "#eee" }}
          centerComponent={{
            text: "Home Screen",
            style: { color: "#000", fontSize: 22 }
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "flex-end",
            paddingVertical: "5%"
          }}
        >
          <Button
            title="Report Now"
            buttonStyle={{
              backgroundColor: "#000",
              marginHorizontal: "20%"
            }}
            onPress={() => {
              this.props.navigation.navigate("Record", {
                // name: "Brent"
              });
            }}
          />
        </View>
      </View>
    );
  }
}

export default HomeScreen;
