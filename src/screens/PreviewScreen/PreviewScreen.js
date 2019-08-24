import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import React, { Component } from "react";
import { Button, Avatar } from "react-native-elements";
// import { Thumbnail } from "react-native-thumbnail-video";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { VidCamData } from "../../actions";
import MovableView from "react-native-movable-view";

class PreviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moveable: true
    };
  }

  render() {
    const { cameraData, videoData } = this.props;
    return (
      <View style={styles.container}>
        {/* <Image
          source={require("../../assets/stickers/sticker1.png")}
          resizeMode="stretch"
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            zIndex: 50,
            position: "absolute"
          }}
        /> */}
        <View style={styles.headerContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.VidCamData({
                prop: "cameraData",
                value: null
              });
              this.props.navigation.navigate("Record");
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 2
              }}
            >
              <Ionicons color="#fff" name="md-close" size={25} />
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Text style={{ fontSize: 18, color: "red", fontWeight: "800" }}>
              LIVE STATUS
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          {this.state.moveable ? (
            <MovableView onDragEnd={() => this.setState({ moveable: false })}>
              <Button
                title="Submit"
                type="solid"
                buttonStyle={{
                  borderRadius: 100,
                  backgroundColor: "#999",
                  paddingHorizontal: 18
                }}
                titleStyle={{ color: "#fff" }}
                onPress={() => {
                  Alert.alert(
                    "MEDIA",
                    "Submitted",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          this.props.VidCamData({
                            prop: "cameraData",
                            value: null
                          });
                          this.props.navigation.navigate("Record");
                        }
                      }
                    ],
                    { cancelable: false }
                  );
                }}
                onLongPress={() => this.setState({ moveable: true })}
                containerStyle={{ zIndex: 150 }}
              />
            </MovableView>
          ) : null}
        </View>
        {cameraData ? (
          <Image
            style={{
              width: null,
              height: "70%",
              flex: 1,
              position: "relative"
            }}
            source={{
              uri: cameraData.uri
            }}
          />
        ) : (
          <View>
            <Text> Nothing yet</Text>
          </View>
        )}
        <View style={styles.footerContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ moveable: true })}
          >
            <View style={{ flexDirection: "row" }}>
              <Avatar
                rounded
                source={{
                  uri:
                    "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg"
                }}
                size={55}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.userData}> @robJones</Text>
                <Text style={styles.userData}> Inverness, Scotland</Text>
                <Text style={styles.userData}> 07 June 2019</Text>
                <Text style={styles.userData}> 14:35 </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
    // position: "absolute"
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 100
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: "22%",
    zIndex: 100
  },
  buttonContainer: {
    position: "absolute",
    top: "40%",
    width: "100%",
    left: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 100
  },
  userData: {
    color: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    videoData: state.RecordingReducer.videoData,
    cameraData: state.RecordingReducer.cameraData
  };
};

export default connect(
  mapStateToProps,
  { VidCamData }
)(PreviewScreen);
