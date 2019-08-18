import { TOGGLE_SELECTED_FILTER_PREVIEW } from "../actions/types";

const INITIAL_STATE = {
  selectedPreview: null,
  interviewFilters: [
    { uri: null, filterName: "None", selected: true },
    {
      uri: require("../assets/stickers/mic1.png"),
      filterName: "Mic 1",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic2.png"),
      filterName: "Mic 2",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic3.png"),
      filterName: "Mic 3",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic4.png"),
      filterName: "Mic 4",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic5.png"),
      filterName: "Mic 5",
      selected: false
    },
    {
      uri: require("../assets/stickers/mic6.png"),
      filterName: "Mic 6",
      selected: false
    }
  ],
  newsFilters: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_SELECTED_FILTER_PREVIEW:
      return { ...state, selectedPreview: action.payload };

    default:
      return state;
  }
};
