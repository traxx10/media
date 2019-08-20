import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ImageBackground,
  Image
} from "react-native";
import { RNCamera } from "react-native-camera";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  toggleFlash,
  toggleCamera,
  onFaceDetected,
  startStopRecording,
  VidCamData,
  toggleFilterPreview
} from "../../actions";
import Sticker1 from "../../assets/stickers/sticker1.svg";
import FilterPreview from "../../components/FilterPreview/FilterPreview";
import { LogLevel, RNFFmpeg } from "react-native-ffmpeg";
import { VideoUtil } from "../../utils/VideoUtil";
import RNFS from "react-native-fs";

async function execute(command) {
  await RNFFmpeg.execute(command).then(result =>
    console.log("FFmpeg process exited with rc " + result.rc)
  );
}

async function executeWithArguments(commandArguments) {
  await RNFFmpeg.executeWithArguments(commandArguments).then(data => {
    console.log("FFmpeg process exited with rc " + data.rc);
  });
}

class RecordingScreen extends PureComponent {
  state = {
    recording: false,
    processing: false,
    filterMenu: false
  };

  async startRecording() {
    this.setState({ recording: true });
    // default to mp4 for android as codec is not set
    const { uri, codec = "mp4" } = await this.camera.recordAsync();

    console.log(uri);
    console.log(codec);
  }

  stopRecording() {
    this.camera.stopRecording();
    this.props.navigation.navigate("Recorded", {});
  }

  renderFlashIcon = () => {};

  renderFilterIcon = () => {};

  cameraType = () => {
    const { frontCamera } = this.props;
    if (frontCamera) {
      return RNCamera.Constants.Type.front;
    } else {
      return RNCamera.Constants.Type.back;
    }
  };

  flashMode = () => {
    const { flash } = this.props;
    if (flash) {
      return RNCamera.Constants.FlashMode.on;
    } else {
      return RNCamera.Constants.FlashMode.off;
    }
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 1,
        base64: true,
        fixOrientation: true,
        forceUpOrientation: true
      };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.props.VidCamData({ prop: "cameraData", value: data });
      this.props.navigation.navigate("Preview");
      // this.props.navigation.navigate("Recorded", {
      //   // name: "Brent"
      // });
    }
  };

  takeVideo = async () => {
    if (this.camera) {
      const options = { quality: "420px", maxDuration: 60 };
      const data = await this.camera.recordAsync(options);
      // console.log(data.uri, "video");
      // RNFFmpeg.execute(`-i ${data.uri} -c:v mpeg4 file2.mp4`).then(result =>
      //   console.log("FFmpeg process exited with rc " + result.rc)
      // );

      this.createVideo();
      this.props.VidCamData({ prop: "videoData", value: data });
    }
  };

  logCallback = logData => {
    this.setState({ encodeOutput: this.state.encodeOutput + logData.log });
  };

  statisticsCallback = statisticsData => {
    console.log(
      "Statistics; frame: " +
        statisticsData.videoFrameNumber.toFixed(1) +
        ", fps: " +
        statisticsData.videoFps.toFixed(1) +
        ", quality: " +
        statisticsData.videoQuality.toFixed(1) +
        ", size: " +
        statisticsData.size +
        ", time: " +
        statisticsData.time
    );
  };

  getLastReceivedStatistics = () => {
    RNFFmpeg.getLastReceivedStatistics().then(stats =>
      console.log("Stats: " + JSON.stringify(stats))
    );
  };

  getMediaInformation = () => {
    RNFFmpeg.getMediaInformation(RNFS.CachesDirectoryPath + "/video.mp4").then(
      info => {
        console.log("\n");
        console.log("Result: " + JSON.stringify(info));
        console.log("Media Information");
        console.log("Path: " + info.path);
        console.log("Format: " + info.format);
        console.log("Duration: " + info.duration);
        console.log("Start time: " + info.startTime);
        console.log("Bitrate: " + info.bitrate);

        this.props.VidCamData({ prop: "videoData", value: { uri: info.path } });
        if (info.streams) {
          for (var i = 0; i < info.streams.length; i++) {
            console.log("Stream id: " + info.streams[i].index);
            console.log("Stream type: " + info.streams[i].type);
            console.log("Stream codec: " + info.streams[i].codec);
            console.log("Stream full codec: " + info.streams[i].fullCodec);
            console.log("Stream format: " + info.streams[i].format);
            console.log("Stream full format: " + info.streams[i].fullFormat);
            console.log("Stream width: " + info.streams[i].width);
            console.log("Stream height: " + info.streams[i].height);
            console.log("Stream bitrate: " + info.streams[i].bitrate);
            console.log("Stream sample rate: " + info.streams[i].sampleRate);
            console.log(
              "Stream sample format: " + info.streams[i].sampleFormat
            );
            console.log(
              "Stream channel layout: " + info.streams[i].channelLayout
            );
            console.log("Stream sar: " + info.streams[i].sampleAspectRatio);
            console.log("Stream dar: " + info.streams[i].displayAspectRatio);
            console.log(
              "Stream average frame rate: " + info.streams[i].averageFrameRate
            );
            console.log(
              "Stream real frame rate: " + info.streams[i].realFrameRate
            );
            console.log("Stream time base: " + info.streams[i].timeBase);
            console.log(
              "Stream codec time base: " + info.streams[i].codecTimeBase
            );

            if (info.streams[i].metadata) {
              console.log(
                "Stream metadata encoder: " + info.streams[i].metadata.encoder
              );
              console.log(
                "Stream metadata rotate: " + info.streams[i].metadata.rotate
              );
              console.log(
                "Stream metadata creation time: " +
                  info.streams[i].metadata.creation_time
              );
              console.log(
                "Stream metadata handler name: " +
                  info.streams[i].metadata.handler_name
              );
            }

            if (info.streams[i].sidedata) {
              console.log(
                "Stream side data displaymatrix: " +
                  info.streams[i].sidedata.displaymatrix
              );
            }
          }
        }
        console.log("\n");
      }
    );
  };

  createVideo = () => {
    RNFFmpeg.enableLogCallback(this.logCallback);
    RNFFmpeg.enableStatisticsCallback(this.statisticsCallback);

    console.log("Testing VIDEO.");

    VideoUtil.resourcePath("colosseum.jpg")
      .then(image1 => {
        console.log("Saved resource colosseum.jpg to " + image1);

        VideoUtil.resourcePath("pyramid.jpg")
          .then(image2 => {
            console.log("Saved resource pyramid.jpg to " + image2);

            VideoUtil.resourcePath("tajmahal.jpg")
              .then(image3 => {
                console.log("Saved resource tajmahal.jpg to " + image3);

                var videoPath = RNFS.CachesDirectoryPath + "/video.mp4";

                console.log("FFmpeg process started with arguments");
                let command = VideoUtil.generateEncodeVideoScript(
                  image1,
                  image2,
                  image3,
                  videoPath,
                  // this.state.videoCodec,
                  "mpeg4",
                  ""
                );
                console.log(command);

                execute(command).then(rc => {
                  this.getMediaInformation();
                });
              })
              .catch(err => {
                console.log("Failed to save resource: tajmahal.jpg");
                console.log(err.message, err.code);
              });
          })
          .catch(err => {
            console.log("Failed to save resource: pyramid.jpg");
            console.log(err.message, err.code);
          });
      })
      .catch(err => {
        console.log("Failed to save resource: colosseum.jpg");
        console.log(err.message, err.code);
      });
  };

  renderFaceDetect = () => {
    const { faceDetectedDetails } = this.props;

    // console.log(faceDetectedDetails.length, "details");
    // if (faceDetectedDetails) {
    //   let faceSize = faceDetectedDetails.faces[0].bounds.size;
    //   let facePosition = faceDetectedDetails.faces[0].bounds.origin;

    //   console.log(facePosition.y, facePosition.x, "sizes");
    //   return (
    //     <View
    //       style={{
    //         height: faceSize.height,
    //         width: faceSize.width,
    //         backgroundColor: "red",
    //         position: "absolute",
    //         top: facePosition.y,
    //         left: facePosition.x - 70
    //       }}
    //     >
    //       <Text>Filter image filters would be here </Text>
    //     </View>
    //   );
    // } else {
    // }

    return null;
  };

  renderFilterMenu = () => {
    const { filterMenu } = this.state;
    const { toggleFilterPreview } = this.props;
    if (!filterMenu) {
      return null;
    } else {
      return (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "absolute",
            flex: 1,
            top: 50,
            marginTop: 20,
            right: 15,
            zIndex: 120
          }}
        >
          <FontAwesome5
            onPress={() => toggleFilterPreview("news")}
            name="user-tie"
            color="green"
            size={20}
            style={{ marginBottom: 25 }}
          />
          <Entypo
            onPress={() => toggleFilterPreview("interview")}
            name="modern-mic"
            color="red"
            size={20}
            style={{ marginBottom: 20 }}
          />
        </View>
      );
    }
  };

  render() {
    const {
      flash,
      toggleFlash,
      recording,
      toggleCamera,
      frontCamera,
      onFaceDetected,
      startStopRecording,
      cameraData,
      videoData,
      toggleFilterPreview
    } = this.props;
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Ionicons
              color="#fff"
              name={flash ? "md-flash" : "md-flash-off"}
              size={25}
              onPress={() => toggleFlash(flash)}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Entypo
              name="controller-record"
              size={15}
              color={recording ? "red" : "#999"}
            />
            <Text style={{ color: recording ? "red" : "#999" }}> REC </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              flexDirection: "column",
              position: "relative"
            }}
          >
            <Ionicons
              color="#fff"
              name="md-menu"
              size={25}
              onPress={() => {
                this.setState({
                  ...this.state,
                  filterMenu: !this.state.filterMenu
                });
                toggleFilterPreview(null);
              }}
            />
          </View>
        </View>
        {this.renderFilterMenu()}
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.cameraType()}
          flashMode={this.flashMode()}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel"
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel"
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
          onFacesDetected={values => {
            // console.log(values, "values");
            onFaceDetected(values);
          }}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        />
        <View style={styles.filterContainer}>
          <FilterPreview />
        </View>
        <View style={styles.footerContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            {recording ? (
              <Feather
                color="red"
                name={"stop-circle"}
                size={35}
                onPress={() => {
                  startStopRecording(recording);
                  this.stopRecording();
                }}
              />
            ) : null}
          </View>
          <TouchableOpacity
            // onPress={() => {
            //   if (!videoData) {
            //     this.takePicture();
            //   }
            // }}

            // onLongPress={() => {
            //   if (!cameraData) {
            //     this.takeVideo();
            //     startStopRecording(recording);
            //   }
            // }}
            onPress={() => {
              if (!cameraData) {
                this.takeVideo();
                startStopRecording(recording);
              }
            }}
            delayLongPress={1500}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <View style={styles.recordButton} />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <Fontisto
              color="#fff"
              name="spinner-refresh"
              onPress={() => {
                toggleCamera(frontCamera);
              }}
              size={25}
            />
          </View>
        </View>
        {/* {this.renderFaceDetect()} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#000"
    // paddingTop: 50,
    // paddingBottom: 50
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: "15%",
    zIndex: 100
  },
  filterContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: "22%",
    zIndex: 100
  },
  recordButton: {
    height: 65,
    width: 65,
    borderRadius: 130,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    flash: state.RecordingReducer.flash,
    frontCamera: state.RecordingReducer.frontCamera,
    recording: state.RecordingReducer.recording,
    faceDetectedDetails: state.RecordingReducer.faceDetectedDetails,
    videoData: state.RecordingReducer.videoData,
    cameraData: state.RecordingReducer.cameraData
  };
};

export default connect(
  mapStateToProps,
  {
    toggleFlash,
    toggleCamera,
    onFaceDetected,
    startStopRecording,
    VidCamData,
    toggleFilterPreview
  }
)(RecordingScreen);
