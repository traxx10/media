import { TOGGLE_SELECTED_FILTER_PREVIEW, SELECT_FILTER } from "./types";

export const toggleFilterPreview = value => {
  return dispatch => {
    dispatch({
      type: TOGGLE_SELECTED_FILTER_PREVIEW,
      payload: value
    });
  };
};

export const selectFilter = (filters, value, selectedIndex) => {
  let newFilters = [...filters];

  let updatedFilter = [];

  newFilters.map((data, index) => {
    if (index === selectedIndex) {
      data.selected = true;
      updatedFilter.push({ ...data });
    } else {
      data.selected = false;
      updatedFilter.push({ ...data });
    }
  });

  return dispatch => {
    dispatch({
      type: SELECT_FILTER,
      payload: value,
      updatedFilter,
      selectedIndex
    });
  };
};
