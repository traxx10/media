import {
  TOGGLE_FLASH,
  TOGGLE_CAMERA,
  ON_FACE_DETECTED,
  START_STOP_RECORDING,
  VIDEO_CAMERA_DATA
} from "./types";

import { LogLevel, RNFFmpeg } from "react-native-ffmpeg";

export const toggleFlash = state => {
  return dispatch => {
    dispatch({
      type: TOGGLE_FLASH,
      payload: !state
    });
  };
};

export const toggleCamera = state => {
  return dispatch => {
    dispatch({
      type: TOGGLE_CAMERA,
      payload: !state
    });
  };
};

export const onFaceDetected = faces => {
  return dispatch => {
    dispatch({
      type: ON_FACE_DETECTED,
      payload: faces
    });
  };
};

export const startStopRecording = recording => {
  return dispatch => {
    dispatch({
      type: START_STOP_RECORDING,
      payload: !recording
    });
  };
};

export const VidCamData = ({ prop, value }) => {
  // RNFFmpeg.execute(`-i ${value.uri} -c:v mpeg4 file2.mp4`).then(result =>
  //   console.log("FFmpeg process exited with rc " + result.rc)
  // );

  // RNFFmpeg.getMediaInformation(`${value.uri}`)
  //   .then(info => {
  //     console.log("Result: " + JSON.stringify(info));
  //   })
  //   .catch(error => console.log(error, "error"));

  let command = `ffmpeg -i ${
    value.uri
  } -i ${require("../assets/stickers/mic1.png")} \
-filter_complex "overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2" test2.mp4`;

  // RNFFmpeg.executeWithArguments(command)
  //   .then(data => console.log("data", data.rc))
  //   .catch(error => {
  //     console.log("error executng command", error);
  //   });

  return dispatch => {
    dispatch({
      type: VIDEO_CAMERA_DATA,
      payload: { prop, value }
    });
  };
};
