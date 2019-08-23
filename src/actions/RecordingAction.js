import {
  TOGGLE_FLASH,
  TOGGLE_CAMERA,
  ON_FACE_DETECTED,
  START_STOP_RECORDING,
  VIDEO_CAMERA_DATA,
  EXTENSION_NAME
} from "./types";

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
  return dispatch => {
    dispatch({
      type: VIDEO_CAMERA_DATA,
      payload: { prop, value }
    });
  };
};

export const extensionName = data => {
  return dispatch => {
    dispatch({
      type: EXTENSION_NAME,
      payload: data
    });
  };
};
