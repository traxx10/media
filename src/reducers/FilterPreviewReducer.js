import {
  TOGGLE_SELECTED_FILTER_PREVIEW,
  SELECT_FILTER
} from "../actions/types";

const INITIAL_STATE = {
  selectedPreview: null,
  selectedFilter: null,
  interviewFilters: [
    { uri: null, filterName: "None", selected: true },
    {
      uri: require("../assets/stickers/mic1.png"),
      filterName: "Mic 1",
      resourceName: "mic1.png",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic2.png"),
      filterName: "Mic 2",
      resourceName: "mic2.png",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic3.png"),
      filterName: "Mic 3",
      selected: false,
      resourceName: "mic3.png"
    },
    {
      uri: require("../assets/stickers/mic4.png"),
      filterName: "Mic 4",
      resourceName: "mic4.png",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic5.png"),
      filterName: "Mic 5",
      resourceName: "mic5.png",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic6.png"),
      resourceName: "mic6.png",
      filterName: "Mic 6",
      selected: false
    }
  ],
  newsFilters: [],
  selectedIndex: 0
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_SELECTED_FILTER_PREVIEW:
      return { ...state, selectedPreview: action.payload };

    case SELECT_FILTER:
      return {
        ...state,
        selectedFilter: action.payload,
        interviewFilters: action.updatedFilter,
        selectedIndex: action.selectedIndex
      };
    default:
      return state;
  }
};
