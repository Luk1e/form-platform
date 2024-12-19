import { combineReducers } from "redux";
import authReducers from "../toolkit/auth/reducer";
import themeReducers from "../toolkit/theme/reducer";

const rootReducer = combineReducers({
  ...themeReducers,
  ...authReducers,
});

export default rootReducer;
