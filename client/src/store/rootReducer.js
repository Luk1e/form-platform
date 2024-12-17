import { combineReducers } from "redux";
import authReducers from "../toolkit/auth/reducer";

const rootReducer = combineReducers({
  ...authReducers,
});

export default rootReducer;
