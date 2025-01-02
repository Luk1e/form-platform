import userContentSlice from "./userContentSlice";
import createFormSlice from "./createFormSlice";
import getFormSlice from "./getFormSlice";
import updateFormSlice from "./updateFormSlice";

const reducer = {
  userContent: userContentSlice,
  createForm: createFormSlice,
  updateForm: updateFormSlice,
  getForm: getFormSlice,
};

export default reducer;
