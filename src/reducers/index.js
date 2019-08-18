import AppReducer from "./AppReducer";
import RecordingReducer from "./RecordingReducer";
import FilterPreviewReducer from "./FilterPreviewReducer";
import { combineReducers } from "redux";

export default combineReducers({
  AppReducer: AppReducer,
  RecordingReducer: RecordingReducer,
  FilterPreviewReducer: FilterPreviewReducer
});
