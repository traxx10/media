import { TOGGLE_SELECTED_FILTER_PREVIEW } from "./types";

export const toggleFilterPreview = value => {
  return dispatch => {
    dispatch({
      type: TOGGLE_SELECTED_FILTER_PREVIEW,
      payload: value
    });
  };
};
