import registerSlice from "./registerSlice";
import loginSlice from "./loginSlice";
import authSlice from "./authSlice";

const reducer = {
  register: registerSlice,
  login: loginSlice,
  authentication: authSlice,
};

export default reducer;
