import { TOGGLE_FLASH, TOGGLE_CAMERA } from "../actions/types";

const INITIAL_STATE = {
  flash: false,
  frontCamera: false,
  recording: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_FLASH:
      return { ...state, flash: action.payload };

    case TOGGLE_CAMERA:
      return { ...state, frontCamera: action.payload };
    default:
      return state;
  }
};
