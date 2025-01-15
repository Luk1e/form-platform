import createAccountSlice from "./createAccountSlice";
import accountSlice from "./accountSlice";

const reducer = {
  salesforceCreateAccount: createAccountSlice,
  salesforceAccount: accountSlice,
};

export default reducer;
