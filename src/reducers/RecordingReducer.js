import {
  TOGGLE_FLASH,
  TOGGLE_CAMERA,
  ON_FACE_DETECTED
} from "../actions/types";

const INITIAL_STATE = {
  flash: false,
  frontCamera: false,
  recording: true,
  faceDetectedDetails: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_FLASH:
      return { ...state, flash: action.payload };

    case TOGGLE_CAMERA:
      return { ...state, frontCamera: action.payload };

    case ON_FACE_DETECTED:
      return { ...state, faceDetectedDetails: action.payload };
    default:
      return state;
  }
};
