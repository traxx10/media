import { TOGGLE_FLASH, TOGGLE_CAMERA } from "./types";

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
