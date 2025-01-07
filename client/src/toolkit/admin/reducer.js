import adminUserSlice from "./adminUserSlice";
import adminContentSlice from "./adminContentSlice";

const reducer = {
  adminUsers: adminUserSlice,
  adminContent: adminContentSlice,
};

export default reducer;
