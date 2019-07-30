import { TOGGLE_FLASH, TOGGLE_CAMERA, ON_FACE_DETECTED } from "./types";

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
