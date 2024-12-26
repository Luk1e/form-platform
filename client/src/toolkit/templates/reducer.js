import templateSlice from "./templateSlice";
import createTemplateSlice from "./createTemplateSlice";
import updateTemplateSlice from "./updateTemplateSlice";
import deleteTemplateSlice from "./deleteTemplateSlice";

const reducer = {
  templates: templateSlice,
  createTemplate: createTemplateSlice,
  updateTemplate: updateTemplateSlice,
  deleteTemplate: deleteTemplateSlice,
};

export default reducer;
