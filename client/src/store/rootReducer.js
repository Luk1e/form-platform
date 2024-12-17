import { combineReducers } from "redux";
import { authReducers } from "../toolkit/auth/reducers";

const rootReducer = combineReducers({
  ...authReducers,
});

export default rootReducer;
