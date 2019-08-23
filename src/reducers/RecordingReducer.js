import {
  TOGGLE_FLASH,
  TOGGLE_CAMERA,
  ON_FACE_DETECTED,
  START_STOP_RECORDING,
  VIDEO_CAMERA_DATA,
  EXTENSION_NAME
} from "../actions/types";

const INITIAL_STATE = {
  flash: false,
  frontCamera: false,
  recording: false,
  faceDetectedDetails: null,
  videoData: null,
  cameraData: null,
  extName: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_FLASH:
      return { ...state, flash: action.payload };

    case TOGGLE_CAMERA:
      return { ...state, frontCamera: action.payload };

    case ON_FACE_DETECTED:
      return { ...state, faceDetectedDetails: action.payload };

    case START_STOP_RECORDING:
      return { ...state, recording: action.payload };

    case VIDEO_CAMERA_DATA:
      return { ...state, [action.payload.prop]: action.payload.value };

    case EXTENSION_NAME:
      return { ...state, extName: action.payload };

    default:
      return state;
  }
};
