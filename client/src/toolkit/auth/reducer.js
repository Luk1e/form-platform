import registerSlice from "./registerSlice";
import loginSlice from "./loginSlice";
import authSlice from "./authSlice";

export const reducer = {
  register: registerSlice,
  login: loginSlice,
  authentication: authSlice,
};
