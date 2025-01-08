import getTemplateSlice from "./getTemplateSlice";
import templateFormSlice from "./templateFormSlice";
import createTemplateSlice from "./createTemplateSlice";
import updateTemplateSlice from "./updateTemplateSlice";
import deleteTemplateSlice from "./deleteTemplateSlice";
import latestTemplateSlice from "./latestTemplateSlice";
import searchTemplateSlice from "./searchTemplateSlice";
import popularTemplateSlice from "./popularTemplateSlice";

const reducer = {
  template: getTemplateSlice,
  templateForms: templateFormSlice,
  createTemplate: createTemplateSlice,
  updateTemplate: updateTemplateSlice,
  deleteTemplate: deleteTemplateSlice,
  searchTemplates: searchTemplateSlice,
  latestTemplates: latestTemplateSlice,
  popularTemplates: popularTemplateSlice,
};

export default reducer;
