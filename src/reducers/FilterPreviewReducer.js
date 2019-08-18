import { TOGGLE_SELECTED_FILTER_PREVIEW } from "../actions/types";

const INITIAL_STATE = {
  selectedPreview: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_SELECTED_FILTER_PREVIEW:
      return { ...state, selectedPreview: action.payload };

    default:
      return state;
  }
};
