import AppReducer from "./AppReducer";
import RecordingReducer from "./RecordingReducer";
import { combineReducers } from "redux";

export default combineReducers({
  AppReducer: AppReducer,
  RecordingReducer: RecordingReducer
});
