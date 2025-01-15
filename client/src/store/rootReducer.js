import { combineReducers } from "redux";
import authReducers from "../toolkit/auth/reducer";
import themeReducers from "../toolkit/theme/reducer";
import adminReducers from "../toolkit/admin/reducer";
import supportReducers from "../toolkit/support/reducer";
import userContentReducers from "../toolkit/user/reducer";
import templateReducers from "../toolkit/templates/reducer";
import salesforceReducers from "../toolkit/salesforce/reducer";

const rootReducer = combineReducers({
  ...authReducers,
  ...themeReducers,
  ...adminReducers,
  ...supportReducers,
  ...templateReducers,
  ...salesforceReducers,
  ...userContentReducers,
});

export default rootReducer;
