import { combineReducers } from "redux";
import authReducer from "./authReducer/AuthReducer";
import dataImport from "./dataImport/DataImport";

const rootReducer = combineReducers({
  authReducer,
  dataImport,
});

export default rootReducer;
