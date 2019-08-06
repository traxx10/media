import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Picker,
  ToastAndroid,
  ProgressBarAndroid
} from "react-native";
import { connect } from "react-redux";
import Video from "react-native-video";

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
      paused: true,
      pickerValueHolder: "1.0",
      pausedText: "Play",
      hideControls: false
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
    this.setState({ paused: true, pausedText: "Play" });
    this.video.seek(0);
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
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.fullScreen}
          onPress={() => this.onPressVideo()}
        >
          {videoData ? (
            <Video
              // source={{
              //   uri:
              //     "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
              // }}
              //   source={{
              //     uri:
              //       "https://rawgit.com/uit2712/Mp3Container/master/tom_and_jerry_31.mp4"
              //   }}
              source={{ uri: videoData.uri }} // Can be a URL or a local file.
              ref={ref => {
                this.video = ref;
              }} // Store reference
              onBuffer={this.onBuffer} // Callback when remote video is buffering
              onError={this.videoError} // Callback when video cannot be loaded
              style={styles.fullScreen}
              rate={this.state.rate}
              paused={this.state.paused}
              volume={this.state.volume}
              muted={this.state.muted}
              resizeMode={this.state.resizeMode}
              onLoad={this.onLoad}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
              onAudioBecomingNoisy={this.onAudioBecomingNoisy}
              onAudioFocusChanged={this.onAudioFocusChanged}
              repeat={false}
            />
          ) : (
            <Text> Hello Nothing</Text>
          )}
          {/* ) : (
          <Text> Hello Nothing </Text>
        )} */}
        </TouchableWithoutFeedback>
        {!this.state.hideControls ? (
          <View style={styles.controls}>
            <View style={styles.generalControls}>
              <View style={styles.rateControl}>
                <Picker
                  style={{ width: 110 }}
                  selectedValue={this.state.pickerValueHolder}
                  onValueChange={(itemValue, itemIndex) =>
                    this.onChangeRate(itemValue, itemIndex)
                  }
                >
                  <Picker.Item label="x1.5" value="1.5" />
                  <Picker.Item label="x1.25" value="1.25" />
                  <Picker.Item label="x1.0" value="1.0" />
                  <Picker.Item label="x0.75" value="0.75" />
                  <Picker.Item label="x0.5" value="0.5" />
                </Picker>
              </View>
              <View style={styles.playControl}>
                <Text onPress={() => this.onPressBtnPlay()}>
                  {this.state.pausedText}
                </Text>
              </View>
              <View style={styles.resizeModeControl}>
                <Picker
                  style={{ width: 150 }}
                  selectedValue={this.state.resizeMode}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ resizeMode: itemValue })
                  }
                >
                  <Picker.Item label="none" value="none" />
                  <Picker.Item label="cover" value="cover" />
                  <Picker.Item label="stretch" value="stretch" />
                  <Picker.Item label="contain" value="contain" />
                </Picker>
              </View>
            </View>

            <View style={styles.trackingControls}>
              <ProgressBarAndroid
                style={styles.progress}
                styleAttr="Horizontal"
                indeterminate={false}
                progress={this.getCurrentTimePercentage()}
              />
              <Text>
                {this.parseSecToTime(parseInt(this.state.currentTime))}/
                {this.parseSecToTime(parseInt(this.state.duration))}
              </Text>
            </View>
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
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
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
  }
});

const mapStateToProps = state => {
  return {
    videoData: state.RecordingReducer.videoData,
    cameraData: state.RecordingReducer.cameraData
  };
};

export default connect(mapStateToProps)(RecordedScreen);
