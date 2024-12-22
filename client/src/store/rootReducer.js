import { combineReducers } from "redux";
import authReducers from "../toolkit/auth/reducer";
import themeReducers from "../toolkit/theme/reducer";
import adminReducers from "../toolkit/admin/reducer";

const rootReducer = combineReducers({
  ...themeReducers,
  ...authReducers,
  ...adminReducers,
});

export default rootReducer;
