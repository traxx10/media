import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Picker,
  ToastAndroid,
  ProgressBarAndroid,
  Alert
} from "react-native";
import { connect } from "react-redux";
import Video from "react-native-video";
import VideoPlayer from "react-native-video-controls";
import { Button, Avatar } from "react-native-elements";
import { Thumbnail } from "react-native-thumbnail-video";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { VidCamData } from "../../actions";
import MovableView from "react-native-movable-view";

class RecordedScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: "contain",
      duration: 0.0,
      currentTime: 0.0,
      paused: false,
      pickerValueHolder: "1.0",
      pausedText: "Play",
      hideControls: false,
      moveable: true
    };

    this.video = Video;
    this.videoError = this.videoError.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
  }

  onLoad = data => {
    this.setState({ duration: data.duration });
  };

  // video is playing
  onProgress = data => {
    this.setState({ currentTime: data.currentTime });
  };

  // video ends
  onEnd = () => {
    this.setState({ paused: true });
  };

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return (
        parseFloat(this.state.currentTime) / parseFloat(this.state.duration)
      );
    }
    return 0;
  }

  onChangeRate(itemValue, itemIndex) {
    var rate = parseFloat(itemValue);
    this.setState({ pickerValueHolder: itemValue, rate: rate });
  }

  // pressing on 'play' button
  onPressBtnPlay() {
    var pausedText = "";
    if (!this.state.paused) {
      pausedText = "Play";

      // always show controls
      if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    } else {
      pausedText = "Pause";

      // hide controls after 5s
      this.timeoutHandle = setTimeout(() => {
        this.setState({ hideControls: true });
      }, 5000);
    }
    this.setState({ paused: !this.state.paused, pausedText: pausedText });
  }

  // on press video event
  onPressVideo() {
    // showing controls if they don't show
    if (this.state.hideControls) {
      this.setState({ hideControls: false });
      this.timeoutHandle = setTimeout(() => {
        this.setState({ hideControls: true });
      }, 5000);
    }
  }

  // parse seconds to time (hour:minute:second)
  parseSecToTime(sec) {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return hours + ":" + minutes + ":" + seconds;
  }

  videoError(error) {
    console.log(error, "video error");
  }

  onBuffer(buffer) {
    console.log(buffer, "video buffer");
  }

  render() {
    const { videoData, cameraData } = this.props;
    const { paused } = this.state;
    return (
      <View style={styles.container}>
        {paused ? (
          <View style={styles.headerContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.VidCamData({
                  prop: "VideoData",
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
        ) : null}
        {paused ? (
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
                              prop: "VideoData",
                              value: null
                            });
                            this.props.navigation.navigate("Record");
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  }}
                />
              </MovableView>
            ) : null}
          </View>
        ) : null}
        {videoData ? (
          <VideoPlayer
            // navigator={() => this.props.navigation.pop()}
            onBack={() => this.props.navigation.navigate("Record")}
            source={{ uri: videoData.uri }} // Can be a URL or a local file.
            ref={ref => {
              this.video = ref;
            }} // Store reference
            onBuffer={this.onBuffer} // Callback when remote video is buffering
            onError={this.videoError} // Callback when video cannot be loaded
            style={styles.fullScreen}
            paused={paused}
            disableSeekbar
            // resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onEnd={this.onEnd}
            repeat={false}
            disableVolume
            disableBack
            onPlay={() => {
              this.setState({ paused: false });
            }}
            onPause={() => {
              this.setState({ paused: true });
            }}
          />
        ) : (
          <View>
            <Text> Loading </Text>
          </View>
        )}
        {paused ? (
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
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  fullScreen: {
    position: "relative"
    // position: "absolute",
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0
  },
  playButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20
  },
  controls: {
    backgroundColor: "white",
    opacity: 0.7,
    borderRadius: 5,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20
  },
  progress: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 3,
    overflow: "hidden"
  },
  rateControl: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  playControl: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
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
    paddingBottom: "22%"
    // zIndex: 100
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
)(RecordedScreen);
