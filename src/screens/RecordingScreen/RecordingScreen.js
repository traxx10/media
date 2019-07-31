import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { RNCamera } from "react-native-camera";
import { connect } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import { toggleFlash, toggleCamera, onFaceDetected } from "../../actions";

class RecordingScreen extends PureComponent {
  state = {
    recording: false,
    processing: false
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
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };

  renderFaceDetect = () => {
    const { faceDetectedDetails } = this.props;

    // console.log(faceDetectedDetails.length, "details");
    if (faceDetectedDetails) {
      let faceSize = faceDetectedDetails.faces[0].bounds.size;
      let facePosition = faceDetectedDetails.faces[0].bounds.origin;

      console.log(facePosition.y, facePosition.x, "sizes");
      return (
        <View
          style={{
            height: faceSize.height,
            width: faceSize.width,
            backgroundColor: "red",
            position: "absolute",
            top: facePosition.y,
            left: facePosition.x
          }}
        >
          <Text>Filter image filters would be here </Text>
        </View>
      );
    } else {
    }
  };

  render() {
    const {
      flash,
      toggleFlash,
      recording,
      toggleCamera,
      frontCamera,
      onFaceDetected
    } = this.props;
    return (
      <View style={styles.container}>
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
              alignItems: "flex-end"
            }}
          >
            <Ionicons
              color="#fff"
              name="md-menu"
              size={25}
              // onPress={() => toggleFlash(flash)}
            />
          </View>
        </View>
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
        <View style={styles.footerContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          />
          <TouchableWithoutFeedback onPress={() => this.takePicture()}>
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
          </TouchableWithoutFeedback>
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
        {this.renderFaceDetect()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
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
    faceDetectedDetails: state.RecordingReducer.faceDetectedDetails
  };
};

export default connect(
  mapStateToProps,
  { toggleFlash, toggleCamera, onFaceDetected }
)(RecordingScreen);
