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
  toggleFilterPreview,
  extensionName
} from "../../actions";
import Sticker1 from "../../assets/stickers/sticker1.svg";
import FilterPreview from "../../components/FilterPreview/FilterPreview";
import { LogLevel, RNFFmpeg } from "react-native-ffmpeg";
import { VideoUtil } from "../../utils/VideoUtil";
import RNFS from "react-native-fs";
import Modal from "react-native-modal";
import randomString from "random-string";
import Spinner from "react-native-spinkit";

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
    modalVisible: false,
    filterMenu: false,
    videoUri: null
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
    this.setState({ processing: true, modalVisible: true });
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
    const { extensionName, selectedFilter } = this.props;
    if (this.camera) {
      const options = {
        quality: 1,
        base64: true,
        fixOrientation: true,
        forceUpOrientation: true
      };
      // const data = await this.camera.takePictureAsync(options);
      // console.log(data.uri);
      // this.props.VidCamData({ prop: "cameraData", value: data });
      // this.props.navigation.navigate("Preview");

      this.camera
        .takePictureAsync(options)
        .then(data => {
          if (selectedFilter) {
            this.createImageFilter(data.uri);
          } else {
            this.props.VidCamData({
              prop: "cameraData",
              value: { uri: data.uri }
            });

            setTimeout(() => {
              this.setState({
                processing: false,
                modalVisible: false
              });
              this.props.navigation.navigate("Preview");
              // this.props.navigation.navigate("Recorded", {});
            }, 1500);
          }
        })
        .catch(() => {
          console.log("error saving video");
        });

      extensionName(randomString({ length: 5 }));
    }
  };

  takeVideo = async () => {
    const { extensionName, selectedFilter } = this.props;
    if (this.camera) {
      const options = {
        quality: RNCamera.Constants.VideoQuality["1080p"],
        maxDuration: 60
      };
      this.camera
        .recordAsync(options)
        .then(data => {
          if (selectedFilter) {
            this.createFilter(data.uri);
          } else {
            this.props.VidCamData({
              prop: "videoData",
              value: { uri: data.uri }
            });

            setTimeout(() => {
              this.setState({
                processing: false,
                modalVisible: false
              });
              this.props.navigation.navigate("Recorded", {});
            }, 1500);
          }
        })
        .catch(() => {
          console.log("error saving video");
        });
      // this.setState({ videoUri: data });
      // this.camera.stopRecording();
      extensionName(randomString({ length: 5 }));
    }
  };

  logCallback = logData => {
    // this.setState({ encodeOutput: this.state.encodeOutput + logData.log });
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

  getMediaInformation = type => {
    const { extName } = this.props;

    RNFFmpeg.getMediaInformation(
      RNFS.CachesDirectoryPath + `/${extName}.mp4`
    ).then(info => {
      console.log("\n");
      console.log("Result: " + JSON.stringify(info));
      console.log("Media Information");
      console.log("Path: " + info.path);
      console.log("Format: " + info.format);
      console.log("Duration: " + info.duration);
      console.log("Start time: " + info.startTime);
      console.log("Bitrate: " + info.bitrate);

      if (type === "video") {
        this.props.VidCamData({
          prop: "videoData",
          value: { uri: info.path }
        });
        this.setState({ processing: false, modalVisible: false });
        setTimeout(() => {
          this.props.navigation.navigate("Recorded", {});
        }, 200);
      } else {
        this.props.VidCamData({
          prop: "cameraData",
          value: { uri: info.path }
        });
        this.setState({ processing: false, modalVisible: false });
        setTimeout(() => {
          this.props.navigation.navigate("Preview", {});
        }, 200);
      }

      // if (info.streams) {
      //   for (var i = 0; i < info.streams.length; i++) {
      //     console.log("Stream id: " + info.streams[i].index);
      //     console.log("Stream type: " + info.streams[i].type);
      //     console.log("Stream codec: " + info.streams[i].codec);
      //     console.log("Stream full codec: " + info.streams[i].fullCodec);
      //     console.log("Stream format: " + info.streams[i].format);
      //     console.log("Stream full format: " + info.streams[i].fullFormat);
      //     console.log("Stream width: " + info.streams[i].width);
      //     console.log("Stream height: " + info.streams[i].height);
      //     console.log("Stream bitrate: " + info.streams[i].bitrate);
      //     console.log("Stream sample rate: " + info.streams[i].sampleRate);
      //     console.log("Stream sample format: " + info.streams[i].sampleFormat);
      //     console.log(
      //       "Stream channel layout: " + info.streams[i].channelLayout
      //     );
      //     console.log("Stream sar: " + info.streams[i].sampleAspectRatio);
      //     console.log("Stream dar: " + info.streams[i].displayAspectRatio);
      //     console.log(
      //       "Stream average frame rate: " + info.streams[i].averageFrameRate
      //     );
      //     console.log(
      //       "Stream real frame rate: " + info.streams[i].realFrameRate
      //     );
      //     console.log("Stream time base: " + info.streams[i].timeBase);
      //     console.log(
      //       "Stream codec time base: " + info.streams[i].codecTimeBase
      //     );

      //     if (info.streams[i].metadata) {
      //       console.log(
      //         "Stream metadata encoder: " + info.streams[i].metadata.encoder
      //       );
      //       console.log(
      //         "Stream metadata rotate: " + info.streams[i].metadata.rotate
      //       );
      //       console.log(
      //         "Stream metadata creation time: " +
      //           info.streams[i].metadata.creation_time
      //       );
      //       console.log(
      //         "Stream metadata handler name: " +
      //           info.streams[i].metadata.handler_name
      //       );
      //     }

      //     if (info.streams[i].sidedata) {
      //       console.log(
      //         "Stream side data displaymatrix: " +
      //           info.streams[i].sidedata.displaymatrix
      //       );
      //     }
      //   }
      // }
      console.log("\n");
    });
  };

  createVideo = recordedVideo => {
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
                  "",
                  recordedVideo
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

  createFilter = video => {
    const { extName, selectedFilter } = this.props;
    let videoPath = RNFS.CachesDirectoryPath + `/${extName}.mp4`;

    VideoUtil.resourcePath(selectedFilter).then(image => {
      console.log("Saved resource mic2.png to " + image);

      let ffmpegCommand =
        "-i " +
        video +
        " -i " +
        image +
        " -filter_complex overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2 " +
        videoPath;

      RNFFmpeg.execute(ffmpegCommand)
        .then(result => {
          console.log("succ ");
          this.getMediaInformation("video");
        })
        .catch(error => {
          console.log(error, "error");
        });
    });
  };

  createImageFilter = cameraImage => {
    const { extName, selectedFilter } = this.props;
    let imagePath = RNFS.CachesDirectoryPath + `/${extName}.mp4`;

    VideoUtil.resourcePath(selectedFilter).then(image => {
      console.log("Saved resource mic2.png to " + image);

      let ffmpegCommand =
        "-i " +
        cameraImage +
        " -i " +
        image +
        " -filter_complex overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2 " +
        imagePath;

      RNFFmpeg.execute(ffmpegCommand)
        .then(result => {
          console.log("succ ");
          this.getMediaInformation("camera");
        })
        .catch(error => {
          console.log(error, "error");
        });
    });
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

  renderFilterImage = () => {
    const {
      selectedPreview,
      selectedIndex,
      interviewFilters,
      newsFilters,
      selectFilter
    } = this.props;

    if (selectedPreview) {
      if (selectedPreview === "interview") {
        if (interviewFilters[selectedIndex].uri) {
          console.log("hehehehehehh");
          console.log(interviewFilters[selectedIndex]);
          return (
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "39%",
                flex: 1,
                zIndex: 2000,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                source={interviewFilters[selectedIndex].uri}
                resizeMode="contain"
                style={{ height: 100, width: 100, flex: 1 }}
              />
            </View>
          );
        } else return null;
      }
    } else {
      return null;
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
        <Modal isVisible={this.state.modalVisible}>
          <View
            style={{
              backgroundColor: "#fff",
              height: "20%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10
            }}
          >
            <Spinner
              style={styles.spinner}
              isVisible={true}
              size={50}
              type={"Circle"}
            />
            <Text style={{ fontWeight: "500", margin: 10, fontSize: 15 }}>
              Please wait while we process your video!
            </Text>
          </View>
        </Modal>
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
              onPress={() => {
                if (!recording) {
                  toggleFlash(flash);
                }
              }}
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
                if (!recording) {
                  this.setState({
                    ...this.state,
                    filterMenu: !this.state.filterMenu
                  });
                  toggleFilterPreview(null);
                }
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
        />
        {this.renderFilterImage()}
        {recording ? null : (
          <View style={styles.filterContainer}>
            <FilterPreview />
          </View>
        )}

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
                  console.log(this.state.videoUri);
                  startStopRecording(recording);
                  this.stopRecording();
                }}
              />
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!recording) {
                if (!videoData) {
                  this.takePicture();
                }
              }
            }}
            onLongPress={() => {
              if (!recording) {
                if (!cameraData) {
                  this.takeVideo();
                  startStopRecording(recording);
                }
              }
            }}
            // onPress={() => {
            //   if (!cameraData) {
            //     this.takeVideo();
            //     startStopRecording(recording);
            //   }
            // }}
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
                if (!recording) {
                  toggleCamera(frontCamera);
                }
              }}
              size={25}
            />
          </View>
        </View>
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
    cameraData: state.RecordingReducer.cameraData,
    selectedPreview: state.FilterPreviewReducer.selectedPreview,
    interviewFilters: state.FilterPreviewReducer.interviewFilters,
    newsFilters: state.FilterPreviewReducer.newsFilters,
    selectedIndex: state.FilterPreviewReducer.selectedIndex,
    selectedFilter: state.FilterPreviewReducer.selectedFilter,
    extName: state.RecordingReducer.extName
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
    toggleFilterPreview,
    extensionName
  }
)(RecordingScreen);
