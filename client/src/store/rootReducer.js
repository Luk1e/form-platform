import { combineReducers } from "redux";
import authReducers from "../toolkit/auth/reducer";
import themeReducers from "../toolkit/theme/reducer";
import adminReducers from "../toolkit/admin/reducer";
import supportReducers from "../toolkit/support/reducer";
import UserContentReducers from "../toolkit/user/reducer";
import templateReducers from "../toolkit/templates/reducer";

const rootReducer = combineReducers({
  ...authReducers,
  ...themeReducers,
  ...adminReducers,
  ...supportReducers,
  ...templateReducers,
  ...UserContentReducers,
});

export default rootReducer;
