import templateSlice from "./templateSlice";
import createTemplateSlice from "./createTemplateSlice";
import updateTemplateSlice from "./updateTemplateSlice";
import deleteTemplateSlice from "./deleteTemplateSlice";
import popularTemplateSlice from "./popularTemplateSlice";
import latestTemplateSlice from "./latestTemplateSlice";
import getTemplateSlice from "./getTemplateSlice";

const reducer = {
  templates: templateSlice,
  createTemplate: createTemplateSlice,
  latestTemplates: latestTemplateSlice,
  popularTemplates: popularTemplateSlice,
  updateTemplate: updateTemplateSlice,
  deleteTemplate: deleteTemplateSlice,
  template: getTemplateSlice,
};

export default reducer;
