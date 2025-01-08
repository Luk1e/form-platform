import getFormSlice from "./getFormSlice";
import createFormSlice from "./createFormSlice";
import updateFormSlice from "./updateFormSlice";
import deleteFormSlice from "./deleteFormSlice";
import userContentSlice from "./userContentSlice";

const reducer = {
  getForm: getFormSlice,
  createForm: createFormSlice,
  updateForm: updateFormSlice,
  deleteForm: deleteFormSlice,
  userContent: userContentSlice,
};

export default reducer;
